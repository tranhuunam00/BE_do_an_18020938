const express = require("express");

const orderRoute = express.Router();

const {
  requireLogin,
  checkPermissions,
  checkLogin,
} = require("../middleware/permission");

const enums = require("../constants/enum");
const { multer } = require("../utils/multer");

const orderController = require("../controllers/order");

orderRoute.get(
  "/",
  requireLogin,
  checkPermissions(enums.UserRole.SALLER, enums.UserRole.CUSTOMER),
  orderController.getAllOrders
);
orderRoute.put(
  "/:orderId",
  requireLogin,
  checkPermissions(enums.UserRole.SALLER, enums.UserRole.CUSTOMER),
  orderController.updateOrder
);
module.exports = orderRoute;
