var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var MemeSchema = new Schema({
  header: {
    type: String,
    required: true
  },
  author: {
    type: String,
    required: true
  },
  imageLink: {
    type: String,
    required: true
  },
  postLink: {
    type: String,
    required: true
  },
  authorLink: {
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