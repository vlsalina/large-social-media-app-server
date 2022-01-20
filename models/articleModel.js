const mongoose = require("mongoose");

const articleSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      required: true,
    },
    authorId: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
      default: "",
    },
    snippet: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
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
    replies: [
      {
        replyId: {
          type: String,
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
    collection: "large-articles",
  }
);

const Article = mongoose.model("Article", articleSchema);

module.exports = Article;
