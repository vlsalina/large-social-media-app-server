var express = require("express");
var usersRouter = express.Router();
const { dataset } = require("../dataset");
const { getRandomName } = require("../utils");
const User = require("../models/userModel");

/* POST /insertMany. */
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

module.exports = usersRouter;
