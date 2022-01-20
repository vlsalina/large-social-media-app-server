var express = require("express");
var articlesRouter = express.Router();
const Article = require("../models/articleModel");
const User = require("../models/userModel");
const Reply = require("../models/replyModel");
const LoremIpsum = require("lorem-ipsum").LoremIpsum;
const { v4: uuidv4 } = require("uuid");
const {
  getRandomCategory,
  authenticateToken,
  getCategory,
} = require("../utils");

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

/********** DEPRECATED *************/
/* PATCH Need to change 'likes' property to an array for each article */
//articlesRouter.patch("/addLikesProp", function (req, res) {
//  Article.find({}, function (error, result) {
//    if (error) {
//      res
//        .status(404)
//        .send({ error: "404 error. No articles found in database." });
//    }
//
//    result.forEach(function (article) {
//      article["likes"] = [];
//      article.save();
//    });
//
//    res.status(200).send(result);
//  });
//});

/* POST /insertMany random users */
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

/* GET retrieve a single article */
articlesRouter.get("/getArticle", authenticateToken, function (req, res) {
  Article.findById(req.query.articleId, function (error, result) {
    if (error) {
      res.status(404).send({ error: error });
    }

    res.status(200).send(result);
  });
});

/* GET retrieve all articles */
articlesRouter.get("/getAllArticles", authenticateToken, function (req, res) {
  Article.find({}, function (error, result) {
    if (error) {
      res.status(404).send({ error: error });
    }

    res.status(200).send(result);
  });
});

/* POST create a new article */
articlesRouter.post("/createArticle", authenticateToken, function (req, res) {
  let newArticle = new Article({
    _id: uuidv4(),
    category: getCategory(req.body.category),
    title: req.body.title,
    author: `${req.user.firstname} ${req.user.lastname}`,
    authorId: req.user._id,
    avatar: req.body.snippet ? req.body.snippet : "",
    snippet: req.body.snippet,
    description: req.body.description,
    content: req.body.content,
    likes: 0,
    replies: [],
  });

  newArticle.save(function (err) {
    if (err) {
      res.status(500).send({ error: err });
    }

    res.status(200).send(newArticle);
  });
});

/* GET retrieve articles by category */
articlesRouter.get(
  "/getArticlesByCategory",
  authenticateToken,
  function (req, res) {
    Article.find({ category: req.query.category }, function (error, result) {
      if (error) {
        res.status(404).send({ error: err });
      }

      res.status(200).send(result);
    });
  }
);

/* PATCH like an article */
articlesRouter.patch("/likeArticle", authenticateToken, function (req, res) {
  let sofar = false;
  Article.findById(req.body.articleId, function (error, result) {
    if (error) {
      res.status(404).send({ error: error });
    }

    result.likes.forEach(function (x) {
      if (x.userId === req.user._id) {
        sofar = true;
      }
    });

    if (sofar) {
      res.status(200).send();
    } else {
      result.likes.push({ userId: req.user._id });
      result.save();

      res.status(200).send(result);
    }
  });
});

/* PATCH unlike an article */
articlesRouter.patch("/unlikeArticle", authenticateToken, function (req, res) {
  Article.findById(req.body.articleId, function (error, result) {
    if (error) {
      res.status(404).send({ error: error });
    }

    result.likes = result.likes.filter(function (user) {
      user._id !== req.user._id;
    });

    result.save();

    res.status(200).send(result);
  });
});

module.exports = articlesRouter;
