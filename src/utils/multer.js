const path = require("path");
const fs = require("fs");
const multer = require("multer");

let storageNoSave = multer.diskStorage({
  // destination: function (req, file, cb) {
  //   cb(null, "public/upload");
  // },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

let storageSave = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/upload");
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

let uploadNoSave = multer({ storage: storageNoSave });

let uploadSave = multer({ storage: storageSave });

module.exports = { uploadSave, uploadNoSave };
