var express = require("express");
var articlesRouter = express.Router();
const Article = require("../models/articleModel");
const User = require("../models/userModel");
const LoremIpsum = require("lorem-ipsum").LoremIpsum;
const { v4: uuidv4 } = require("uuid");
const { getRandomCategory } = require("../utils");

const lorem = new LoremIpsum({
  sentencesPerParagraph: {
    max: 16,
    min: 8,
  },
  wordsPerSentence: {
    max: 16,
    min: 8,
  },
});

/* GET /test */
articlesRouter.get("/test", function (req, res, next) {
  res.send(articlesDataset);
});

/* POST /insertMany */
articlesRouter.post("/insertMany", function (req, res, next) {
  User.find({}, function (err, users) {
    if (err) {
      res.status(404).send({ error: err });
    }
    let articlesDataset = [];
    for (let i = 0; i < 10; i++) {
      let randomAuthor = users[Math.floor(Math.random() * 10)];

      articlesDataset.push({
        _id: uuidv4(),
        category: getRandomCategory(),
        title: lorem.generateWords(8),
        author: `${randomAuthor.firstname} ${randomAuthor.lastname}`,
        authorId: randomAuthor._id,
        avatar: "",
        snippet: lorem.generateSentences(3),
        description: lorem.generateParagraphs(1),
        content: lorem.generateParagraphs(7),
        likes: 0,
        replies: [],
      });
    }

    Article.insertMany(articlesDataset, function (err, result) {
      if (err) {
        res.status(500).send({ error: err });
      }
      console.log("Insert successful");
      res.status(200).send(result);
    });
  });
});

/* DELETE /deleteMany */
articlesRouter.delete("/deleteMany", function (req, res, next) {
  Article.deleteMany({}, function (error, result) {
    if (error) {
      res.status(500).send({ error: error });
    } else {
      console.log("Deleted all articles.");
      res.status(200).send(result);
    }
  });
});

module.exports = articlesRouter;
