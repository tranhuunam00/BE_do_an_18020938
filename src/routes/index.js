const express = require("express");
const indexRoute = express.Router();
const userRoute = require("./user");
const googleRoute = require("./google");

const customerRoute = require("./customer");

module.exports = indexRoute;

indexRoute.use("/customers", customerRoute);
indexRoute.use("/users", userRoute);
indexRoute.use("/google", googleRoute);
