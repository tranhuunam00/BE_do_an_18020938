const express = require("express");
const sallerRoute = express.Router();
const { requireLogin, checkPermissions } = require("../middleware/permission");
const enums = require("../constants/enum");
//
const sallerController = require("../controllers/saller");

//post

sallerRoute.get(
  "/",
  // requireLogin,
  // checkPermissions(enums.UserRole.SALLER),
  sallerController.getAllSaller
);

sallerRoute.get(
  "/profile",
  requireLogin,
  checkPermissions(enums.UserRole.SALLER),
  sallerController.getDetailsSaller
);

module.exports = sallerRoute;
