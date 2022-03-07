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
const session = require("express-session");
const httpResponses = require("./utils/httpResponses");
const keys = require("./constants/keys");
//datebase --mongo
const db = require("./config/db/index");
db.connect();
//datebase --

//public-folder
app.set("trust proxy", 1); // trust first proxy
app.use(
  session({
    secret: keys.SESSION_SECRET_KEY,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true },
  })
);
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
app.use((req, res, next) => {
  res.badRequest = (message) => {
    return res.status(httpResponses.HTTP_STATUS_BAD_REQUEST).json({
      success: false,
      message: message,
    });
  };
  res.notFound = (message) => {
    return res.status(httpResponses.HTTP_STATUS_NOT_FOUND).json({
      success: false,
      message: message,
    });
  };
  res.internalServer = (message) => {
    return res.status(httpResponses.HTTP_STATUS_INTERNAL_ERROR).json({
      success: false,
      message: message,
    });
  };
  res.ok = (message, data) => {
    const responseObj = {
      success: true,
    };
    message && (responseObj.message = message);
    data && (responseObj.data = data);
    return res.status(httpResponses.HTTP_STATUS_OK).json(responseObj);
  };
  res.created = (message, data) => {
    const responseObj = {
      success: true,
      message: message,
    };
    data && (responseObj.data = data);
    return res.status(httpResponses.HTTP_STATUS_CREATED).json(responseObj);
  };
  res.response = (statusCode, success, message) => {
    return res.status(statusCode).json({
      success: success,
      message: message,
    });
  };
  next();
});
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
    let img;
    if (!req.files) {
      return res.json("chuwa co file");
    }
    img = req.files.img;
    const done = await upload.uploadMultiGgDrive(img);
    return res.json(done);
  }
);
app.listen(process.env.PORT || 3000, () => {});
