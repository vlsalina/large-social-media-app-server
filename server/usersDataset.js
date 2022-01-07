const { getRandomName } = require("./utils");
const { v4: uuidv4 } = require("uuid");

let usersDataset = [];
for (let i = 0; i < 10; i++) {
  let fname = getRandomName();
  let lname = getRandomName();
  usersDataset.push({
    _id: uuidv4(),
    firstname: fname,
    lastname: lname,
    email: fname + "." + lname + "@example.com",
    password: "12345",
    picture: "",
    favorites: [],
  });
}

module.exports = { usersDataset };
