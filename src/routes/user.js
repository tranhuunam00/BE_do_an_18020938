const express = require("express");
const userRoute = express.Router();
const userController = require("../controllers/user");
var fs = require("fs");

module.exports = userRoute;

userRoute.post("/avatar", (req, res) => {
  console.log(req.body);
  console.log(req.files.avatar);
  res.json("ok");
});

userRoute.get("/pdf", userController.getAllUsersExportPdf);

userRoute.get("/", userController.getAllUsers);
