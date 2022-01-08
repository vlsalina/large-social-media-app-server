var express = require("express");
var usersRouter = express.Router();
const { v4: uuidv4 } = require("uuid");
const { usersDataset } = require("../usersDataset");
const { getRandomName, authenticateToken, hashSync } = require("../utils");
const mongoose = require("mongoose");
const User = require("../models/userModel");

/* PATCH Need to add 'following' property for each user */
usersRouter.patch("/addFollowingProp", function (req, res) {
  User.find({}, function (error, result) {
    if (error) {
      res.status(404).send({ error: "404 error. No users found in database." });
    }

    result.forEach(function (user) {
      user["following"] = [];
      user.save();
    });

    res.sendStatus(200);
  });
});

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
      following: result.following,
      favorites: result.favorites,
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

/* PATCH follow another user */
usersRouter.patch("/follow", authenticateToken, function (req, res) {
  User.findById(req.query.id, function (error, result) {
    if (error) {
      res.status(404).send({ error: "404 error. User not found." });
    }

    result.following.push({ _id: req.body._id });
    let update = result;
    result.save();

    res.status(200).send(update);
  });
});

module.exports = usersRouter;
