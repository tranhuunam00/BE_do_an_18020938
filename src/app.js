const express = require("express");
const app = express();
const port = 3000;
require("dotenv").config();

//datebase --mongo
const db = require("./config/db/index");
db.connect();
//datebase --

app.get("/", (req, res) => {
  logger.info(`ngon r`);
  res.sendFile(path.join(__dirname, "./home.html"));
});

app.listen(process.env.PORT || 3000, () => {
  console.log(`Example app listening on port ${port}`);
});
