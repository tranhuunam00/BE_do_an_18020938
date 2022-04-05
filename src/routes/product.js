const express = require("express");
const productRoute = express.Router();
const { requireLogin, checkPermissions } = require("../middleware/permission");
const enums = require("../constants/enum");
const { multer } = require("../utils/multer");

const productController = require("../controllers/product");

productRoute.post(
  "/",
  requireLogin,
  checkPermissions(enums.UserRole.SALLER),
  multer.fields([
    {
      name: "img",
    },
  ]),
  productController.createProduct
);

productRoute.get("/:sallerId", productController.getALlProduct);

module.exports = productRoute;
