const mongoose = require("mongoose");
const connection = process.env.MONGODB_URI;
mongoose
  .connect(connection, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Successfully connected to database."))
  .catch((err) => console.log(err));
