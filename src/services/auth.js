const jwt = require("jsonwebtoken");
const keys = require("../constants/keys");
const constants = require("../constants/constants");

module.exports.generateToken = (payload) => {
  const token = jwt.sign(
    payload,
    keys.SESSION_SECRET_KEY || "‘nam_do_an_18020938’",
    {
      expiresIn: constants.EXPIRES_IN,
    }
  );

  return token;
};

module.exports.generateToken5Min = (payload) => {
  const token = jwt.sign(
    payload,
    keys.SESSION_SECRET_KEY || "‘nam_do_an_18020938’",
    {
      expiresIn: constants.EXPIRES_IN_5MIN,
    }
  );

  return token;
};

module.exports.verifyToken = (token) => {
  const payload = jwt.verify(
    token,
    keys.SESSION_SECRET_KEY || "‘nam_do_an_18020938’"
  );
  return payload;
};
