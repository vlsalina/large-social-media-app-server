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
      res.status(404).json({ message: "Account not found." });
    }

    if (!bcrypt.compareSync(req.body.password, result.password)) {
      res.status(403).json({ message: "Email or password is incorrect." });
    } else {
      const user = session(result);

      res.status(200).json(user);
    }
  });
});

module.exports = authRouter;
