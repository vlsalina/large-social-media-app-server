const mongoose = require("mongoose");

const replySchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
    },
    content: {
      type: String,
      required: true,
    },
    likes: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    collection: "large-replies",
  }
);

const Reply = mongoose.model("Reply", replySchema);

module.exports = Reply;
