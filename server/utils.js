// name generator
const { uniqueNamesGenerator, names } = require("unique-names-generator");

function getRandomName() {
  const randomName = uniqueNamesGenerator({ dictionaries: [names] }); // name
  return randomName;
}

module.exports = { getRandomName };
