var express = require("express");
var articlesRouter = express.Router();
const articlesDataset = require("../articlesDataset");
const Article = require("../models/articleModel");
const User = require("../models/userModel");

/* GET /test */
articlesRouter.get("/test", function (req, res, next) {
  res.send(articlesDataset);
});

/* POST /insertMany */
articlesRouter.post("/insertMany", function (req, res, next) {
  Article.insertMany(articlesDataset, function (error, result) {
    if (error) {
      res.status(500).send({ error: error });
    } else {
      console.log("Insert successful.");
      res.status(200).send(result);
    }
  });
});

/* DELETE /deleteMany */
articlesRouter.delete("/deleteMany", function (req, res, next) {
  Article.deleteMany({}, function (error, result) {
    if (error) {
      res.status(500).send({ error: error });
    } else {
      console.log("Delete all articles.");
      res.status(200).send(result);
    }
  });
});

module.exports = articlesRouter;
