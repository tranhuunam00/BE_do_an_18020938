const express = require("express");
const app = express();
const path = require("path");
const indexRoute = require("./routes/index");
const multer = require("./utils/multer");
const fs = require("fs");
require("dotenv").config();
const upload = require("./services/googleDriveService");
var bodyParser = require("body-parser");
const session = require("express-session");
const httpResponses = require("./utils/httpResponses");
const keys = require("./constants/keys");
const cookieParser = require("cookie-parser");
const passport = require("passport");
var cors = require("cors");
const { createSocketIO } = require("./services/io");
app.use(cors());
const socket = require("socket.io");
require("./helpers/passport");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
//datebase --mongo
const db = require("./config/db/index");
db.connect();
//datebase --

//public-folder
app.set("trust proxy", 1); // trust first proxy
app.use(cookieParser(keys.SESSION_SECRET_KEY));
app.use(
  session({
    secret: keys.SESSION_SECRET_KEY,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true },
  })
);

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

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function (user, cb) {
  cb(null, user);
});

passport.deserializeUser(function (obj, cb) {
  cb(null, obj);
});
//api

app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/error" }),
  function (req, res) {
    return res.json(req.user);
    res.redirect("/");
  }
);
app.get("/", (req, res) => {
  console.log(req.signedCookies);
  res.cookie("name", "namdziui", {
    expires: new Date(Date.now() + 900000),
    signed: true,
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

const server = app.listen(process.env.PORT || 3000, () => { });

var io = createSocketIO(server);
app.use((req, res, next) => {
  req.io = io;

  next();
});
app.use("/api", indexRoute);
