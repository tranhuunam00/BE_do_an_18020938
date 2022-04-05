const pdf = require("../helpers/pdf/pdf");
const logger = require("../utils/logger");
const httpResponses = require("../utils/httpResponses");

//
const templateHelper = require("../helpers/template");
const mailerHelper = require("../helpers/mailer");
const constants = require("../constants/constants");
const enums = require("../constants/enum");
//
const authService = require("../services/auth");
const userService = require("../services/user");
const securityService = require("../services/security");
const customerService = require("../services/customer");
const walletService = require("../services/wallet");
const paymentMomoService = require("../services/momo");
const sallerService = require("../services/sallers");
//

/**
 * get all
 */

const getAllSaller = async (req, res) => {
  try {
    logger.debug(`[getAllSaller] ${httpResponses.SUCCESS}`);
    res.ok(httpResponses.SUCCESS);
  } catch (e) {
    logger.error(`[getProfile]`);
    return res.internalServer(e.message);
  }
};

/**
 * get detail
 */

const getDetailsSaller = async (req, res) => {
  try {
    const { saller } = req.session;
    logger.info(`[getDetailsSaller] sallerId -> ${saller._id}`);
    const sallerExist = await sallerService.getDetailsSaller(saller._id);

    if (!sallerExist) {
      logger.debug(`[getDetailsSaller] ${httpResponses.SALLER_NOT_FOUND}`);
      return res.notFound(httpResponses.SALLER_NOT_FOUND);
    }

    logger.debug(`[getDetailsSaller] ${httpResponses.SUCCESS}`);
    res.ok(httpResponses.SUCCESS, sallerExist);
  } catch (e) {
    logger.error(`[getDetailsSaller]`);
    return res.internalServer(e.message);
  }
};
module.exports = {
  getAllSaller,
  getDetailsSaller,
};
