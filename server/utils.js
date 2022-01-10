const categories = require("./categories/categories");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// random name generator
const { uniqueNamesGenerator, names } = require("unique-names-generator");

function getRandomName() {
  const randomName = uniqueNamesGenerator({ dictionaries: [names] }); // name
  return randomName;
}

// get random category
function getRandomCategory() {
  const keys = Object.keys(categories);
  return keys[Math.floor(Math.random() * keys.length)].toLowerCase();
}

// get designated category
function getCategory(cat) {
  const keys = Object.keys(categories);
  return categories[cat.toUpperCase()];
}

// use bcrypt to encrypt passwords
const saltRounds = 10;
function hashSync(plaintext) {
  const salt = bcrypt.genSaltSync(saltRounds);
  const hash = bcrypt.hashSync(plaintext, salt);
  return hash;
}

// generate jwt
function getToken(user) {
  const accessToken = jwt.sign(
    user,
    process.env.ACCESS_TOKEN_SECRET || "access-token-secret"
  );
  return accessToken;
}

// authenticate token
function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    return res.sendStatus(401);
  }

  jwt.verify(token, "access-token-secret", function (err, result) {
    if (err) return res.sendStatus(403);
    req.user = result;
    next();
  });
}

module.exports = {
  getRandomName,
  getRandomCategory,
  hashSync,
  getToken,
  authenticateToken,
  getCategory,
};
