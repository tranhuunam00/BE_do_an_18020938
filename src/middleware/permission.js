const httpResponses = require("../utils/httpResponses");
const logger = require("../utils/logger");
const enums = require("../constants/enum");
//
const authService = require("../services/auth");
const customerService = require("../services/customer");

const requireLogin = async (req, res, next) => {
  try {
    if (req.headers.authorization) {
      const token = req.headers.authorization.split(" ")[1];

      const user = authService.verifyToken(token);

      req.session.user = user;
      switch (user.role) {
        case enums.UserRole.CUSTOMER:
          const customer = await customerService.getOneCustomerByFilter({
            user: user._id,
          });
          if (!customer) {
            logger.debug(
              `[requireLogin]: find customer by user id -> ${httpResponses.CUSTOMER_NOT_FOUND}`
            );
            return res.status(httpResponses.HTTP_STATUS_UNAUTHORIZED).json({
              success: false,
              message: `${httpResponses.customer_NOT_FOUND}`,
            });
          }
          req.session.customer = customer;
          break;

        default:
          break;
      }
      logger.info(`[RequireLogin]: ${JSON.stringify(user)}`);
      next();
    } else {
      logger.debug(`[RequireLogin]: error -> ${httpResponses.UNAUTHORIZED}`);
      return res.status(httpResponses.HTTP_STATUS_UNAUTHORIZED).json({
        success: false,
        message: `${httpResponses.UNAUTHORIZED}`,
      });
    }
  } catch (error) {
    logger.error(`[RequireLogin]: error -> ${error.message}`);
    return res
      .status(httpResponses.HTTP_STATUS_INTERNAL_ERROR)
      .json({ success: false, message: `Error: ${error.message}` });
  }
};

const checkPermissions = (...roles) => {
  return (req, res, next) => {
    try {
      const user = req.session.user;
      logger.info(`[checkPermissions]: userId -> ${user._id}`);
      if (Array.isArray(roles) && roles.includes(user.role)) {
        logger.debug(`[checkPermissions]: ${httpResponses.CAN_GET_ACCESS}`);
        return next();
      }
      logger.error(
        `[checkPermissions]: error -> ${httpResponses.PERMISSION_DENIED}`
      );
      return res.status(httpResponses.HTTP_STATUS_UNAUTHORIZED).json({
        success: false,
        message: `Error: ${httpResponses.PERMISSION_DENIED}`,
      });
    } catch (err) {
      logger.error(`[checkPermissions]: error -> ${err.message}`);
      res
        .status(httpResponses.HTTP_STATUS_INTERNAL_ERROR)
        .json({ success: false, message: `Error: ${err.message}` });
    }
  };
};

module.exports = {
  checkPermissions,
  requireLogin,
};
