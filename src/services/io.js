const socket = require("socket.io");
const logger = require("../utils/logger");
const httpResponses = require("../utils/httpResponses");
var socketArray = {};

const createSocketIO = (server) => {
  const io = socket(server, {
    cors: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  });
  io.on("connection", function (socket) {
    socket.emit("connected", "connected");
    logger.debug(`[connection] ${httpResponses.SUCCESS}`);
    onTest(io, socket);
    onDisconnect(io, socket);
  });
  return io;
};

const onTest = (io, socket) => {
  return socket.on("test", function (data) {
    console.log(data);
    io.emit("return", data);
  });
};

const onDisconnect = (io, socket) => {
  return socket.on("disconnect", function (data) {
    logger.debug(`[disconnect] ${httpResponses.SUCCESS}`);
    socket.disconnect();
  });
};

module.exports = { createSocketIO };
