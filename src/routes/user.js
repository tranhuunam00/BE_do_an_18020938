const express = require("express");
const userRoute = express.Router();
const userController = require("../controllers/user");
var fs = require("fs");
const { requireLogin, checkPermissions } = require("../middleware/permission");
const enums = require("../constants/enum");

userRoute.get("/send-mail", userController.sendMail);

userRoute.get("/pdf", userController.getAllUsersExportPdf);

userRoute.get("/pdf_puppeteer", userController.getAllUsersExportPdfByPuppeteer);

userRoute.get(
  "/",
  requireLogin,
  checkPermissions(enums.UserRole.ADMIN),
  userController.getAllUsers
);

//post

userRoute.post("/login", userController.login);

module.exports = userRoute;
