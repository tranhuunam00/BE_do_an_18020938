const express = require("express");
const app = express();
const port = 3000;
const path = require("path");
const logger = require("./utils/logger");
require("dotenv").config();

//datebase --mongo
const db = require("./config/db/index");
db.connect();
//datebase --

//public-folder
app.use("/public", express.static(path.join(__dirname, "./public")));
app.use("/docs", express.static(path.join(__dirname, "docs")));

app.get("/", (req, res) => {
  logger.debug("home");
  res.sendFile(path.join(__dirname, "../public/home.html"));
});

app.listen(process.env.PORT || 3000, () => {
  console.log(`Example app listening on port ${port}`);
});
