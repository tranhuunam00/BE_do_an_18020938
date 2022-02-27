const express = require("express");
const app = express();
const path = require("path");
const logger = require("./utils/logger");
const indexRoute = require("./routes/index");
const multer = require("./utils/multer");
const fs = require("fs");
require("dotenv").config();
const upload = require("./services/googleDriveService");
var bodyParser = require("body-parser");

//datebase --mongo
const db = require("./config/db/index");
db.connect();
//datebase --

//public-folder
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
  res.header("Allow", "GET, POST, OPTIONS, PUT, DELETE");
  next();
});
app.use("/public", express.static(path.join(__dirname, "./public")));
app.use("/docs", express.static(path.join(__dirname, "docs")));

//api

app.use("/api", indexRoute);

app.get("/", (req, res) => {
  logger.debug("home");
  const sgMail = require("@sendgrid/mail");
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  const msg = {
    to: "tranhuunam23022000@gmail.com", // Change to your recipient
    from: "18020938@vnu.edu.vn.com", // Change to your verified sender
    subject: "Sending with SendGrid is Fun",
    text: "and easy to do anywhere, even with Node.js",
    html: "<strong>and easy to do anywhere, even with Node.js</strong>",
  };
  sgMail
    .send(msg)
    .then(() => {
      console.log("Email sent");
    })
    .catch((error) => {
      console.error(error);
    });
  res.sendFile(path.join(__dirname, "../public/home.html"));
});

//upload File lên google drive
app.post(
  "/encode",
  multer.multer.fields([
    {
      name: "img",
      maxCount: 4,
    },
  ]),
  async (req, res) => {
    console.log(req.files);

    let img;
    if (!req.files) {
      return res.json("chuwa co file");
    }
    img = req.files.img;

    // const fileName = Date.now().toString() + "_" + req.file.originalname;
    const done = await upload.uploadMultiGgDrive(img);

    return res.json(done);
  }
);
app.listen(process.env.PORT || 3000, () => {});
