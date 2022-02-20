const mongoose = require("mongoose");
async function connect() {
  try {
    mongoose.connect(
      "mongodb+srv://udic-admin:gUi6Trs4Vqq3YNG@udic-dev.kzbr4.mongodb.net/udic-dev?retryWrites=true&w=majority",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        // useFindAndModify: false,
        // useCreateIndex: true,
      }
    );
    console.log("connect mongo db done!");
  } catch (e) {
    console.log(e.message);
  }
}
module.exports = {
  connect,
};
