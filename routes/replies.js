const express = require("express");
const repliesRouter = express.Router();
const { v4: uuidv4 } = require("uuid");
const Reply = require("../models/replyModel");
const Article = require("../models/articleModel");
const { authenticateToken } = require("../utils");

// GET retrieve all replies by articleId
repliesRouter.get("/getAllReplies", function (req, res, next) {
  Article.findById(req.query.articleId, function (error, result) {
    if (error) {
      res.status(404).send({ error: error });
    }

    res.status(200).send(result.replies);
  });
});

// GET retrieve a reply by articleId
repliesRouter.get("/getReply", function (req, res) {
  Reply.findById(req.query.replyId, function (error, result) {
    if (error) {
      res.status(404).send({ error: error });
    }

    res.status(200).send(result);
  });
});

/* POST add a reply to an article */
repliesRouter.post("/addReply", authenticateToken, function (req, res) {
    let reply = new Reply({
      _id: uuidv4(),
      articleId: req.body.articleId,
      author: `${req.user.firstname} ${req.user.lastname}`,
      userId: req.user._id,
      avatar: req.user.avatar ? req.user.avatar : "",
      content: req.body.content,
      likes: [],
    });

    reply.save();

    res.status(200).send(reply);
  });
});

/* PATCH like a reply */
repliesRouter.patch("/likeReply", authenticateToken, function (req, res) {
  Article.findById(req.body.articleId, function (error, result) {
    if (error) {
      res.status(404).send({ error: error });
    }

    let replies = result.replies;
    let user;
    replies.forEach(function (reply) {
      if (reply._id === req.body.replyId) {
        user = reply.likes.find(function (x) {
          return x.userId === req.user._id;
        });
      }
    });

    if (user) {
      res.status(200).send({ message: "User has already liked this reply." });
    } else {
      replies.forEach(function (reply) {
        if (reply._id === req.body.replyId) {
          reply.likes.push({ userId: req.user._id });
        }
      });

      result.replies = replies;
      result.save();

      res.status(200).send(result);
    }
  });
});

/* PATCH unlike a reply */
repliesRouter.patch("/unlikeReply", authenticateToken, function (req, res) {
  Article.findById(req.body.articleId, function (error, result) {
    if (error) {
      res.status(404).send({ error: error });
    }

    let replies = result.replies;
    replies.forEach(function (reply) {
      let likesUpdated;
      if (reply._id === req.body.replyId) {
        likesUpdated = reply.likes.filter(function (user) {
          return user.userId !== req.user._id;
        });

        reply.likes = likesUpdated;
      }
    });

    result.replies = replies;
    result.save();

    res.status(200).send(result);
  });
});

module.exports = repliesRouter;
