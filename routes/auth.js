var express = require("express");
var authRouter = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/userModel");
const { session } = require("../utils");

const saltRounds = 10;

/* POST /login */
authRouter.post("/login", function (req, res) {
  User.findOne({ email: req.body.email }, function (error, result) {
    if (error) {
      res.status(404).json(error);
    }

    if (!bcrypt.compareSync(req.body.password, result.password)) {
      res.sendStatus(403);
    } else {
      //const data = {
      //  _id: result._id,
      //  firstname: result.firstname,
      //  lastname: result.lastname,
      //  email: result.email,
      //  avatar: result.avatar,
      //  picture: result.picture,
      //  story: result.story,
      //  following: result.following,
      //  followers: result.followers,
      //  favorites: result.favorites,
      //};

      //const accessToken = getToken(data);

      //const user = {
      //  ...data,
      //  accessToken: accessToken,
      //};

      const user = session(result);

      res.status(200).json(user);
    }
  });
});

module.exports = authRouter;
