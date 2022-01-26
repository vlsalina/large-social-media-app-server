var express = require("express");
var authRouter = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/userModel");
const { getToken } = require("../utils");

const saltRounds = 10;

/* POST /login */
authRouter.post("/login", function (req, res) {
  User.findOne({ email: req.body.email }, function (error, result) {
    if (error) {
      res.status(404).send({ error: "404 error. User not found." });
    }

    if (!bcrypt.compareSync(req.body.password, result.password)) {
      res
        .status(401)
        .send({ message: "Incorrect email or password provided." });
    }

    const data = {
      _id: result._id,
      firstname: result.firstname,
      lastname: result.lastname,
      email: result.email,
      story: result.story,
      picture: result.picture,
      following: result.following,
      followers: result.followers,
      favorites: result.favorites,
    };

    const accessToken = getToken(data);

    const user = {
      ...data,
      accessToken: accessToken,
    };

    res.json(user);
  });
});

module.exports = authRouter;
