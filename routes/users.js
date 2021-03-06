var express = require("express");
var usersRouter = express.Router();
const { v4: uuidv4 } = require("uuid");
const { usersDataset } = require("../data/usersDataset");
const {
  getRandomName,
  authenticateToken,
  hashSync,
  getColor,
  session,
} = require("../utils");
const mongoose = require("mongoose");
const User = require("../models/userModel");
const rules = require("nodemon/lib/rules");
const Article = require("../models/articleModel");

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
usersRouter.get("/getUser", function (req, res) {
  User.findOne({ _id: req.query.id }, function (error, result) {
    if (error) {
      res.status(404).json({ error: "404 Error. User not found." });
    }

    let user = {
      _id: result._id,
      firstname: result.firstname,
      lastname: result.lastname,
      email: result.email,
      avatar: result.avatar,
      story: result.story,
      picture: result.picture,
      following: result.following.map((x) => x.userId),
      followers: result.followers.map((x) => x.userId),
      favorites: result.favorites.map((x) => x.articleId),
    };

    res.status(200).json(user);
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
        avatar: user.avatar,
        story: user.story,
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
    avatar: getColor(),
    story: "",
    password: hashSync(req.body.password),
    picture: "",
    following: [],
    followers: [],
    favorites: [],
  });

  await user
    .save()
    .then(function (user) {
      res.status(200).json(user);
    })
    .catch(function (error) {
      res.status(500).json({ message: "Error 500. Internal server error." });
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
      res.status(404).json({ error });
    }

    // add user to author's followers list
    User.findById(req.body.userId, function (error, author) {
      let alreadyInFollowersList = false;
      if (error) {
        res.status(404).json({ error });
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
      res.status(200).json(session(result));
    } else {
      // add author to user's following list
      result.following.push({ userId: req.body.userId });
      //let update = result;
      result.save();

      res.status(200).json(session(result));
    }
  });
});

/* PATCH add article to user's favorites */
usersRouter.patch("/favorite", authenticateToken, function (req, res) {
  let sofar = false;
  User.findById(req.user._id, function (error, result) {
    if (error) {
      res.status(404).json({ error });
    }

    result.favorites.forEach(function (x) {
      if (x.articleId === req.body.articleId) {
        sofar = true;
      }
    });

    if (sofar) {
      res.status(200).json(session(result));
    } else {
      result.favorites.push({ articleId: req.body.articleId });
      result.save();

      res.status(200).json(session(result));
    }
  });
});

/* PATCH unfollow another user */
usersRouter.patch("/unfollow", authenticateToken, function (req, res) {
  User.findById(req.user._id, function (error, result) {
    if (error) {
      res.status(404).json({ error });
    }

    // remove user from author's followers list
    User.findById(req.body.userId, function (error, author) {
      if (error) {
        res.status(404).json({ error });
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

    //let updated = result;

    result.save();

    res.status(200).send(session(result));
  });
});

/* PATCH unfavorite an article */
usersRouter.patch("/unfavorite", authenticateToken, function (req, res) {
  User.findById(req.user._id, function (error, result) {
    if (error) {
      res.status(404).json({ error });
    }

    result.favorites = result.favorites.filter(function (x) {
      return x.articleId !== req.body.articleId;
    });

    //let update = result;

    result.save();

    res.status(200).json(session(result));
  });
});

module.exports = usersRouter;
