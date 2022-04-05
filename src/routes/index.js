const express = require("express");
const indexRoute = express.Router();
const userRoute = require("./user");
const googleRoute = require("./google");
const sallerRoute = require("./saller");
const customerRoute = require("./customer");
const productRoute = require("./product");
module.exports = indexRoute;

indexRoute.use("/customers", customerRoute);
indexRoute.use("/users", userRoute);
indexRoute.use("/google", googleRoute);
indexRoute.use("/sallers", sallerRoute);
indexRoute.use("/products", productRoute);
