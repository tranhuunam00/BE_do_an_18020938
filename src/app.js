const express = require("express");
const app = express();
const port = 3000;
require("dotenv").config();

//datebase --mongo
const db = require("./config/db/index");
db.connect();
//datebase --

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(process.env.PORT || 3000, () => {
  console.log(`Example app listening on port ${port}`);
});
