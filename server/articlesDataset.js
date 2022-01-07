const LoremIpsum = require("lorem-ipsum").LoremIpsum;
const { v4: uuidv4 } = require("uuid");
const User = require("./models/userModel");

const lorem = new LoremIpsum({
  sentencesPerParagraph: {
    max: 16,
    min: 8,
  },
  wordsPerSentence: {
    max: 16,
    min: 8,
  },
});

//lorem.generateWords(1);
//lorem.generateSentences(5);
//lorem.generateParagraphs(7);

let articlesDataset = [];

User.find({}, function (error, result) {
  if (error) {
    console.log(error);
  }

  for (let i = 0; i < 10; i++) {
    let randomAuthor = result[Math.floor(Math.random() * 10)];

    articlesDataset.push({
      _id: uuidv4(),
      title: lorem.generateWords(8),
      author: `${randomAuthor.firstname} ${randomAuthor.lastname}`,
      authorId: randomAuthor._id,
      avatar: "",
      snippet: lorem.generateSentences(3),
      description: lorem.generateParagraphs(1),
      content: lorem.generateParagraphs(7),
      likes: 0,
      replies: [],
    });
  }
});

module.exports = articlesDataset;
