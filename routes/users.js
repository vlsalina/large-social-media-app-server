var express = require("express");
var usersRouter = express.Router();
const { v4: uuidv4 } = require("uuid");
const { usersDataset } = require("../data/usersDataset");
const { getRandomName, authenticateToken, hashSync } = require("../utils");
const mongoose = require("mongoose");
const User = require("../models/userModel");
const rules = require("nodemon/lib/rules");
const Article = require("../models/articleModel");

/********** DEPRECATED *************/
/* PATCH Need to add 'following' property for each user */
//usersRouter.patch("/addFollowingProp", function (req, res) {
//  User.find({}, function (error, result) {
//    if (error) {
//      res.status(404).send({ error: "404 error. No users found in database." });
//    }
//
//    result.forEach(function (user) {
//      user["following"] = [];
//      user.save();
//    });
//
//    res.sendStatus(200);
//  });
//});

/********** DEPRECATED *************/
/* PATCH Need to add 'followers' property for each user */
//usersRouter.patch("/addFollowersProp", function (req, res) {
//  User.find({}, function (error, result) {
//    if (error) {
//      res.status(404).send({ error: "404 error. No users found in database." });
//    }
//
//    result.forEach(function (user) {
//      user["followers"] = [];
//      user.save();
//    });
//
//    let updatedUserBase = result;
//
//    res.status(200).send(updatedUserBase);
//  });
//});

/********** DEPRECATED *************/
/* PATCH Need to add 'story' property for each user */
//usersRouter.patch("/addStoryProp", function (req, res) {
//  User.find({}, function (error, result) {
//    if (error) {
//      res.status(404).send({ error: "404 error. No users found in database." });
//    }
//
//    result.forEach(function (user) {
//      user["story"] = "";
//      user.save();
//    });
//
//    let updatedUserBase = result;
//
//    res.status(200).send(updatedUserBase);
//  });
//});

/* POST /insertMany. */
usersRouter.post("/insertMany", function (req, res, next) {
  User.insertMany(usersDataset, function (error, result) {
    if (error) {
      res.status(500).send({ error: error });
    } else {
      console.log("Insert successful.");
      res.status(200).send(result);
    }
  });
});

/* DELETE /deleteMany */
usersRouter.delete("/deleteMany", function (req, res, next) {
  User.deleteMany({}, function (error, result) {
    if (error) {
      res.status(500).send({ error: error });
    } else {
      console.log("Deleted all users.");
      res.status(200).send(result);
    }
  });
});

/* GET retrieve a user's data */
usersRouter.get("/getUser", authenticateToken, function (req, res) {
  User.findOne({ _id: req.query.id }, function (error, result) {
    if (error) {
      res.status(404).send({ error: "404 Error. User not found." });
    }

    let user = {
      _id: result._id,
      firstname: result.firstname,
      lastname: result.lastname,
      email: result.email,
      picture: result.picture,
      following: result.following.map((x) => x.userId),
      followers: result.followers.map((x) => x.userId),
      favorites: result.favorites.map((x) => x.articleId),
    };

    res.status(200).send(user);
  });
});

/* GET all users */
usersRouter.get("/getAllUsers", authenticateToken, function (req, res) {
  User.find({}, function (error, result) {
    if (error) {
      res.status(404).send({ error: "404 Error. No users in database." });
    }

    let users = result.map(function (user) {
      return {
        _id: user._id,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        picture: user.picture,
        following: user.following,
        followers: user.followers,
        favorites: user.favorites,
      };
    });

    res.status(200).send(users);
  });
});

/* POST add a new user */
usersRouter.post("/register", async function (req, res) {
  let user = new User({
    _id: uuidv4(),
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    email: req.body.email,
    password: hashSync(req.body.password),
    picture: "",
    following: [],
    followers: [],
    favorites: [],
  });

  await user
    .save()
    .then(function () {
      res.sendStatus(200);
    })
    .catch(function (error) {
      res.sendStatus(500);
    });
});

/* PUT update users profile */
usersRouter.put("/update", authenticateToken, function (req, res) {
  // make sure user is not deleting someone else's account
  if (req.user._id !== req.body._id) {
    res.sendStatus(405);
  }

  User.findByIdAndUpdate(req.body._id, req.body, function (error, result) {
    if (error) {
      res.status(404).send({ error: "404 error. User not found." });
    }

    res.status(200).send(result);
  });
});

/********** DISABLED *************/
/* DELETE delete a user */
usersRouter.delete("/delete", authenticateToken, function (req, res) {
  // make sure user is not deleting someone else's account
  if (req.user._id !== req.query.id) {
    res.sendStatus(405);
  }

  User.findByIdAndDelete(req.query.id, function (error, result) {
    if (error) {
      res.status(404).send({ error: "404 error. User not found." });
    }

    res.status(200).send(result);
  });

  // IMPORTANT! once user deletes his account, jwt must be invalidated/deleted on client side
});
/*********** END DISABLED **********/

/* PATCH follow another user */
usersRouter.patch("/follow", authenticateToken, function (req, res) {
  let sofar = false;
  User.findById(req.user._id, function (error, result) {
    if (error) {
      res.status(404).send({ error: "404 error. User not found." });
    }

    // add user to author's followers list
    User.findById(req.body.userId, function (error, author) {
      let alreadyInFollowersList = false;
      if (error) {
        res.status(404).send({ error: "404 error. Author not found." });
      }

      author.followers.forEach(function (x) {
        if (x.userId === req.user._id) {
          alreadyInFollowersList = true;
        }
      });

      if (!alreadyInFollowersList) {
        author.followers.push({ userId: req.user._id });
        author.save();
      }

      // else user is already in author's followers list
    });

    // if user is already following, return already is following message
    result.following.forEach(function (x) {
      if (x.userId === req.body.userId) {
        sofar = true;
      }
    });

    if (sofar) {
      res.status(200).send({ message: "Already following author." });
    } else {
      // add author to user's following list
      result.following.push({ userId: req.body.userId });
      let update = result;
      result.save();

      res.status(200).send(update);
    }
  });
});

/* PATCH add article to user's favorites */
usersRouter.patch("/favorite", authenticateToken, function (req, res) {
  let sofar = false;
  User.findById(req.user._id, function (error, result) {
    if (error) {
      res.status(404).send({ error: "404 error. User not found." });
    }

    result.favorites.forEach(function (x) {
      if (x.articleId === req.body.articleId) {
        sofar = true;
      }
    });

    if (sofar) {
      res.status(200).send({ message: "Article already added to favorites." });
    } else {
      result.favorites.push({ articleId: req.body.articleId });
      let update = result;
      result.save();

      res.status(200).send(update);
    }
  });
});

/* PATCH unfollow another user */
usersRouter.patch("/unfollow", authenticateToken, function (req, res) {
  User.findById(req.user._id, function (error, result) {
    if (error) {
      res.status(404).send({ error: "404 error. User not found" });
    }

    // remove user from author's followers list
    User.findById(req.body.userId, function (error, author) {
      if (error) {
        res.status(404).send({ error: "404 error. Author not found." });
      }

      let updatedFollowers = author.followers.filter(function (x) {
        return x.userId !== req.user._id;
      });

      author.followers = updatedFollowers;
      author.save();
    });

    result.following = result.following.filter(function (x) {
      return x.userId !== req.body.userId;
    });

    result.save();
    res.status(200).send(result);
  });
});

/* PATCH unfavorite an article */
usersRouter.patch("/unfavorite", authenticateToken, function (req, res) {
  User.findById(req.user._id, function (error, result) {
    if (error) {
      res.status(404).send({ error: "404 error. User not found" });
    }

    result.favorites = result.favorites.filter(function (x) {
      return x.articleId !== req.body.articleId;
    });

    result.save();
    res.status(200).send(result);
  });
});

module.exports = usersRouter;
