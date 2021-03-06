const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      required: true,
    },
    firstname: {
      type: String,
      required: true,
    },
    lastname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
      required: true,
      default: "#000000",
    },
    picture: {
      type: String,
      required: false,
      default: "",
    },
    story: {
      type: String,
      default: "",
    },
    following: [
      {
        userId: {
          type: String,
          required: true,
        },
      },
    ],
    followers: [
      {
        userId: {
          type: String,
          required: true,
        },
      },
    ],
    favorites: [
      {
        articleId: {
          type: String,
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
    collection: "large-users",
  }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
