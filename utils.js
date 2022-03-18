const categories = require("./categories/categories");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { colors } = require("./data/data");

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

// generate session
function session(result) {
  const data = {
    _id: result._id,
    firstname: result.firstname,
    lastname: result.lastname,
    email: result.email,
    avatar: result.avatar,
    picture: result.picture,
    story: result.story,
    following: result.following,
    followers: result.followers,
    favorites: result.favorites,
  };

  const accessToken = getToken(data);

  const user = {
    ...data,
    accessToken: accessToken,
  };

  return user;
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

// get random avatar color
function getColor() {
  let index = Math.floor(Math.random() * colors.length);
  return colors[index];
}

module.exports = {
  getRandomName,
  getRandomCategory,
  hashSync,
  getToken,
  authenticateToken,
  getCategory,
  getColor,
  session,
};
