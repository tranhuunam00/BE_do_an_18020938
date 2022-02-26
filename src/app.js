const express = require("express");
const app = express();
const path = require("path");
const logger = require("./utils/logger");
const indexRoute = require("./routes/index");
const multer = require("./utils/multer");
const fs = require("fs");
require("dotenv").config();
const googleDriveService = require("./services/googleDriveService");
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
const driveClientId = process.env.GOOGLE_DRIVE_CLIENT_ID || "";
const driveClientSecret = process.env.GOOGLE_DRIVE_CLIENT_SECRET || "";
const driveRedirectUri = process.env.GOOGLE_DRIVE_REDIRECT_URI || "";
const driveRefreshToken = process.env.GOOGLE_DRIVE_REFRESH_TOKEN || "";

app.use("/api", indexRoute);

app.get("/uploadGoogleDrive", async (req, res) => {
  try {
    const driveClient = googleDriveService.createDriveClient(
      driveClientId,
      driveClientSecret,
      driveRedirectUri,
      driveRefreshToken
    );

    const finalPath = path.resolve(__dirname, "../public/hotgirl.jpg");
    const folderName = "Picture";

    if (!fs.existsSync(finalPath)) {
      return res.json("file not found!");
    }

    let folder = await googleDriveService
      .searchFolder(folderName, driveClient)
      .catch((error) => {
        console.error(error);
        return res.json(error.message);
      });

    console.log(folder);
    if (!folder) {
      folder = await googleDriveService.createFolder(folderName);
    }
    const done = await new Promise(function (resolve, reject) {
      googleDriveService
        .saveFile("456", finalPath, "image/jpg", folder.id, driveClient)
        .then((r) => {
          resolve(r);
        })
        .catch((err) => {
          reject(err);
        });
    });
    console.log(done);
    res.json("ooki");
  } catch (err) {
    return res.json(err.message);
  }
});
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

app.post("/encode", multer.uploadNoSave.single("img"), (req, res) => {
  console.log(req.file);
  const data = fs.readFileSync(req.file.path, "utf8");
  const buf = Buffer.from(req.file);

  res.json(data);
});
app.listen(process.env.PORT || 3000, () => {});
