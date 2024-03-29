const express = require("express");
const customerRoute = express.Router();
var fs = require("fs");
const { requireLogin, checkPermissions } = require("../middleware/permission");
const enums = require("../constants/enum");
//
const userController = require("../controllers/user");
const customerController = require("../controllers/customer");

//post

customerRoute.post("/sign-up", customerController.signUp);

customerRoute.post(
  "/order",
  requireLogin,
  checkPermissions(enums.UserRole.CUSTOMER),
  customerController.createOrder
);

customerRoute.post(
  "/cart",
  requireLogin,
  checkPermissions(enums.UserRole.CUSTOMER),
  customerController.createCartCustomer
);

customerRoute.get(
  "/increment-momo",
  //   requireLogin,
  //   checkPermissions(enums.UserRole.CUSTOMER),
  customerController.incrementMoneyByMomo
);
customerRoute.get(
  "/return-momo-payment/:token",
  customerController.paymentWithMomoReturn
);

customerRoute.get(
  "/cart",
  requireLogin,
  checkPermissions(enums.UserRole.CUSTOMER),
  customerController.getCartsCustomer
);

customerRoute.get("/profile", requireLogin, customerController.getProfile);

customerRoute.get("/:_id", customerController.getDetailsCustomer);

customerRoute.get(
  "/",
  requireLogin,
  checkPermissions(enums.UserRole.CUSTOMER),
  customerController.getAllCustomer
);

customerRoute.put(
  "/cart",
  requireLogin,
  checkPermissions(enums.UserRole.CUSTOMER),
  customerController.updateCartCustomer
);

customerRoute.delete(
  "/cart",
  requireLogin,
  checkPermissions(enums.UserRole.CUSTOMER),
  customerController.deleteCartCustomer
);

module.exports = customerRoute;
