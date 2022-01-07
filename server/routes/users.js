var express = require("express");
var usersRouter = express.Router();
const { dataset } = require("../dataset");
const { getRandomName } = require("../utils");
const User = require("../models/userModel");

/* GET users listing. */
usersRouter.post("/insertMany", function (req, res, next) {
  User.insertMany(dataset, function (error, result) {
    if (error) {
      res.status(500).send({ error: error });
    } else {
      console.log("Insert successful.");
      res.status(200).send(result);
    }
  });
});

module.exports = usersRouter;
