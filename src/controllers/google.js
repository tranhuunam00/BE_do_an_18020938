const googleHelper = require("../helpers/google");

const logger = require("../utils/logger");
const constants = require("../constants/constants");

const getTokenGoogleAPi = async (req, res) => {
  logger.debug("[googleController] start");
  const result = await googleHelper.getTokenGoogleAPi(req.query);
  res.json(result);
};

const createGoogleCalender = async (req, res) => {
  const { refreshToken } = req.body;
  const result = await googleHelper.createGoogleCalender(refreshToken);
  res.json(result);
};

module.exports = { getTokenGoogleAPi, createGoogleCalender };
