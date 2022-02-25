const express = require("express");
const app = express();
const path = require("path");
const logger = require("./utils/logger");
const indexRoute = require("./routes/index");
const multer = require("./utils/multer");
const fs = require("fs");
require("dotenv").config();

//datebase --mongo
const db = require("./config/db/index");
db.connect();
//datebase --

//public-folder
app.use("/public", express.static(path.join(__dirname, "./public")));
app.use("/docs", express.static(path.join(__dirname, "docs")));

//api
app.use("/api", indexRoute);

app.get("/", (req, res) => {
  logger.debug("home");
  res.sendFile(path.join(__dirname, "../public/home.html"));
});

app.post("/encode", multer.uploadNoSave.single("img"), (req, res) => {
  console.log(req.file);
  const data = fs.readFileSync(req.file.path, "utf8");
  const buf = Buffer.from(req.file);

  res.json(data);
});
app.listen(process.env.PORT || 3000, () => {});
