const mongoose = require("mongoose");
const connection =
  "mongodb+srv://new-user_31:password12345@cluster0.oqwop.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
mongoose
  .connect(connection, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Successfully connected to database."))
  .catch((err) => console.log(err));
