const categories = require("./categories/categories");
const bcrypt = require("bcrypt");

// name generator
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

// use bcrypt to encrypt passwords
const saltRounds = 10;
function hashSync(plaintext) {
  const salt = bcrypt.genSaltSync(saltRounds);
  const hash = bcrypt.hashSync(plaintext, salt);
  return hash;
}

module.exports = { getRandomName, getRandomCategory, hashSync };
