const express = require("express");
const googleController = require("../controllers/google");
const googleRoute = express.Router();

var fs = require("fs");

const enums = require("../constants/enum");

googleRoute.get("/return-calender", googleController.getTokenGoogleAPi);

//post
googleRoute.post("/create-calender", googleController.createGoogleCalender);

module.exports = googleRoute;
