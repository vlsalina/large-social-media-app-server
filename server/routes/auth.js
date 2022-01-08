var express = require("express");
var authRouter = express.Router();
const bcrypt = require("bcrypt");
const { hashAsync } = require("../utils");

const saltRounds = 10;

authRouter.post("/hashpw", function (req, res) {
  let hashed = hashAsync(req.body.password);
  res.status(200).send(hashed);
});

module.exports = authRouter;
