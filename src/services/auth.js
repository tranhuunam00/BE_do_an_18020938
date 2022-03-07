const jwt = require("jsonwebtoken");
const keys = require("../constants/keys");
const constants = require("../constants/constants");

module.exports.generateToken = (payload) => {
  const token = jwt.sign(payload, keys.SESSION_SECRET_KEY || "‘nam_18020938’", {
    expiresIn: constants.EXPIRES_IN,
  });

  return token;
};

module.exports.generateToken60S = (payload) => {
  const token = jwt.sign(payload, keys.SESSION_SECRET_KEY || "‘nam_18020938’", {
    expiresIn: constants.EXPIRES_IN_60S,
  });

  return token;
};

module.exports.verifyToken = (token) => {
  const payload = jwt.verify(
    token,
    keys.SESSION_SECRET_KEY || "‘nam_18020938’"
  );
  return payload;
};
