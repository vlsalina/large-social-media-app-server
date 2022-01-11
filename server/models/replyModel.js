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
    userId: {
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
    likes: [
      {
        userId: {
          type: String,
          required: true,
        },
      },
    ],
    createdAt: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    collection: "large-replies",
  }
);

const Reply = mongoose.model("Reply", replySchema);

module.exports = Reply;
