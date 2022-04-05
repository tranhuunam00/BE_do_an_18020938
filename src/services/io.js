const socket = require("socket.io");
const logger = require("../utils/logger");
const httpResponses = require("../utils/httpResponses");
var socketArray = {};

const createSocketIO = (server) => {
  const io = socket(server, { cors: "*" });
  io.on("connection", function (socket) {
    logger.debug(`[connection] ${httpResponses.SUCCESS}`);
    onTest(io, socket);
  });
  return io;
};

const onTest = (io, socket) => {
  return socket.on("test", function (data) {
    console.log(data);
    io.emit("return", data);
  });
};
const ioEmitAll = (io) => {
  return io.emit("return", "con ga con");
};

module.exports = { createSocketIO, ioEmitAll };
