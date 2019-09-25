var express = require("express");
var exphbs = require("express-handlebars");
var logger = require("morgan");
var mongoose = require("mongoose");
var axios = require("axios");
var cheerio = require("cheerio");

// Require all models
var db = require("./models");

// Set PORT
var PORT = process.env.PORT || 3000;

// Initialize Express
var app = express();

// Morgan logger for logging requests
app.use(logger("dev"));

// Parse as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Public static folder
app.use(express.static("public"));

// Handlebars
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Connect to Mongo DB
mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/mongoMemes_db", { useNewUrlParser: true });

// Route for main page
app.get("/", function (req, res) {
    res.render("index", {});
});

// Route for scraping top 25 memes
app.get("/scrape", function (req, res) {
    axios.get("https://old.reddit.com/r/memes/").then(function (response) {
        var $ = cheerio.load(response.data); // Load response into cheerio

        $(".thing").each(function (i, element) { // Grab all articles and scrape variables
            if ($(this).attr("data-domain") === "i.redd.it") {
                var result = {}; // Save empty result object

                result.postLink = "https://www.reddit.com" + $(this).children("a.thumbnail").attr("href"); // Get link of post
                result.image = $(this).attr("data-url"); // Get image of post
                result.header = $(this).children("div.entry").children("div.top-matter").children("p.title").text().slice(0, -12); // Get header of post
                result.authorLink = $(this).children("div.entry").children("div.top-matter").children("p.tagline").children("a").attr("href").replace("old", "www"); // Get link of author
                result.author = $(this).children("div.entry").children("div.top-matter").children("p.tagline").children("a").text(); // Get author of post

                db.Meme.create(result) // Create a new meme object built from "result"
                    .then(function (data) { console.log("\n" + data + "\n"); })
                    .catch(function (err) { console.log("\n" + err + "\n"); });
            }
        });

        res.send("Scrape complete!");
    });
});

// Route for getting all memes from the db
app.get("/memes", function (req, res) {
    db.Meme.find({})
        .then(function (data) { res.json(data); })
        .catch(function (err) { res.json(err); });
});

// Route for getting a meme by id and populating it with comments
app.get("/memes/:id", function (req, res) {
    db.Meme.findOne({ _id: req.params.id })
        .populate("comments")
        .then(function (data) { res.json(data); })
        .catch(function (err) { res.json(err); });
});

// Route for saving/updating a meme's associated comment
app.post("/memes/:id", function (req, res) {
    db.Comment.create(req.body) // Create a new comment and pass in req.body
        .then(function (data) { return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: data._id }, { new: true }); })
        .then(function (dbArticle) { res.json(dbArticle); })
        .catch(function (err) { res.json(err); });
});

// Server listen
app.listen(PORT, function () {
    console.log(`Listening on http://localhost:${PORT}...`);
});

module.exports = app;