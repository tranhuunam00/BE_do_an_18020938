const mongoose = require("mongoose");
async function connect() {
  try {
    mongoose.connect(
      "mongodb+srv://nam18020938:tS6B1fs2tVuGsKtD@cluster0.tdb8j.mongodb.net/18020938_do_an?authSource=admin&replicaSet=atlas-11n93s-shard-0&readPreference=primary&appname=MongoDB%20Compass&ssl=true",
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
