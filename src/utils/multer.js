const path = require("path");
const fs = require("fs");
const Multer = require("multer");
const logger = require("./logger");
let storageNoSave = Multer.diskStorage({
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

let storageSave = Multer.diskStorage({
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

const multer = Multer({
  storage: storageNoSave,
  limits: { fileSize: 10 * 1024 * 1024 },
});

let uploadNoSave = Multer({ storage: storageNoSave });

let uploadSave = Multer({ storage: storageSave });

module.exports = { uploadSave, uploadNoSave, multer };
