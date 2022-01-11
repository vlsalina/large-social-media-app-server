var express = require("express");
var authRouter = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/userModel");
const { getToken } = require("../utils");

const saltRounds = 10;

/* POST /login */
authRouter.post("/login", function (req, res) {
  User.findOne({ _id: req.body._id }, function (error, result) {
    if (error) {
      res.status(404).send({ error: "404 error. User not found." });
    }
    const user = {
      _id: result._id,
      firstname: result.firstname,
      lastname: result.lastname,
      email: result.email,
    };

    const accessToken = getToken(user);

    res.json({ accessToken: accessToken });
  });
});

module.exports = authRouter;
