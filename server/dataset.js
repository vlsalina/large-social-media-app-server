const { getRandomName } = require("./utils");

let dataset = [];
for (let i = 0; i < 10; i++) {
  let fname = getRandomName();
  let lname = getRandomName();
  dataset.push({
    firstname: fname,
    lastname: lname,
    email: fname + "." + lname + "@example.com",
    password: "12345",
    picture: "",
    favorites: [],
  });
}

module.exports = { dataset };
