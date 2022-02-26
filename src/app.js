const express = require("express");
const app = express();
const path = require("path");
const logger = require("./utils/logger");
const indexRoute = require("./routes/index");
const multer = require("./utils/multer");
const fs = require("fs");
require("dotenv").config();
const googleDriveService = require("./helpers/googleDriveService");

//datebase --mongo
const db = require("./config/db/index");
db.connect();
//datebase --

//public-folder
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
    // if (!folder) {
    //   folder = await googleDriveService.createFolder(folderName);
    // }
    const done = await new Promise(function (resolve, reject) {
      googleDriveService
        .saveFile("SpaceX", finalPath, "image/jpg", folder.id, driveClient)
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
  res.sendFile(path.join(__dirname, "../public/home.html"));
});

app.post("/encode", multer.uploadNoSave.single("img"), (req, res) => {
  console.log(req.file);
  const data = fs.readFileSync(req.file.path, "utf8");
  const buf = Buffer.from(req.file);

  res.json(data);
});
app.listen(process.env.PORT || 3000, () => {});
