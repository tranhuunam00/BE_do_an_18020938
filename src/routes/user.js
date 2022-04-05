const express = require("express");
const userRoute = express.Router();
const userController = require("../controllers/user");
var fs = require("fs");
const { requireLogin, checkPermissions } = require("../middleware/permission");
const enums = require("../constants/enum");
const { multer } = require("../utils/multer");

userRoute.get("/send-mail", userController.sendMail);

userRoute.get("/pdf", userController.getAllUsersExportPdf);

userRoute.get("/pdf_puppeteer", userController.getAllUsersExportPdfByPuppeteer);

userRoute.get("/pdf_html", userController.exportByHtml);

userRoute.get(
  "/",
  requireLogin,
  checkPermissions(enums.UserRole.ADMIN),
  userController.getAllUsers
);

userRoute.get("/confirm-register", userController.confirmRegister);

//post

userRoute.post("/login", userController.login);

userRoute.post("/login-google", userController.login);

userRoute.post(
  "/register",
  multer.fields([
    {
      name: "avatar",
    },
  ]),
  userController.register
);

userRoute.post("/forgot-password", userController.forgotPassword);

userRoute.post("/reset-password", userController.resetPassword);

userRoute.post("/refresh-token", userController.refreshToken);

userRoute.put(
  "/profile",
  requireLogin,
  multer.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
    {
      name: "cover",
      maxCount: 1,
    },
  ]),
  userController.updateUser
);

userRoute.delete("/logout", userController.logout);

module.exports = userRoute;
