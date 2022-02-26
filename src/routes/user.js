const express = require("express");
const userRoute = express.Router();
const userController = require("../controllers/user");
var fs = require("fs");
module.exports = userRoute;

userRoute.get("/send-mail", userController.sendMail);

userRoute.get("/pdf", userController.getAllUsersExportPdf);

userRoute.get("/", userController.getAllUsers);
