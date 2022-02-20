const jwt = require('jsonwebtoken');
const keys = require('../constants/keys');
const constants = require('../constants/constants');

module.exports.generateToken = (payload) => {
  const token = jwt.sign(payload, keys.SESSION_SECRET_KEY, {
    expiresIn: constants.EXPIRES_IN,
  });

  return token;
};

module.exports.verifyToken = (token) => {
  const payload = jwt.verify(token, keys.SESSION_SECRET_KEY);
  return payload;
};
