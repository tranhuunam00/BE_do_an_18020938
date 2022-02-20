var winston = require("winston");
require("dotenv").config();

// const { LoggingWinston } = require('@google-cloud/logging-winston');

var logger;

if (process.env.NODE_ENV || "http" === "http") {
  // const loggingWinston = new LoggingWinston();
  logger = winston.createLogger({
    transports: [
      new winston.transports.Console(),
      //  loggingWinston
    ],
    level: process.env.WINSTON_LOGGER_LOG_LEVEL || "debug",
  });
} else {
  logger = winston.createLogger({
    transports: [new winston.transports.Console()],
    level: process.env.WINSTON_LOGGER_LOG_LEVEL || "debug",
  });
}

module.exports = logger;
