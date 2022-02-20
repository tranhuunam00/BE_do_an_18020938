const express = require("express");
const indexRoute = express.Router();
const userRoute = require("./user");

module.exports = indexRoute;

indexRoute.use("/users", userRoute);
