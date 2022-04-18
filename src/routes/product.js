const express = require("express");
const productRoute = express.Router();
const {
  requireLogin,
  checkPermissions,
  checkLogin,
} = require("../middleware/permission");
const enums = require("../constants/enum");
const { multer } = require("../utils/multer");

const productController = require("../controllers/product");

productRoute.post(
  "/",
  requireLogin,
  checkPermissions(enums.UserRole.SALLER),
  multer.fields([
    {
      name: "imgProduct",
    },
  ]),
  productController.createProduct
);
productRoute.get("/detail/:productId", productController.getDetailProduct);

productRoute.get("/:sallerId", productController.getALlProductBySallerId);

productRoute.put(
  "/:productId",
  requireLogin,
  checkPermissions(enums.UserRole.SALLER),
  multer.fields([
    {
      name: "imgProduct",
    },
  ]),
  productController.updateProduct
);

module.exports = productRoute;
