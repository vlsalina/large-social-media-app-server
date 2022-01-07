const express = require("express");
const repliesRouter = express.Router();
const Reply = require("../models/replyModel");

repliesRouter.get("/getAllReplies", function (req, res, next) {
  Reply.find({}, function (error, result) {
    if (error) {
      res.status(500).send({ error: error });
    } else {
      res.status(200).send(result);
    }
  });
});

module.exports = repliesRouter;
