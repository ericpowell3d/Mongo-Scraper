var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var MemeSchema = new Schema({
  postLink: {
    type: String,
    required: true
  },
  header: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  authorLink: {
    type: String,
    required: true
  },
  author: {
    type: String,
    required: true
  },
  comment: {
    type: Schema.Types.ObjectId,
    ref: "Comment"
  }
});

var Meme = mongoose.model("Meme", MemeSchema);

module.exports = Meme;