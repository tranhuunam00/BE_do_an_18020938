const httpResponses = require("../utils/httpResponses");
const logger = require("../utils/logger");
const enums = require("../constants/enum");
//
const authService = require("../services/auth");
const customerService = require("../services/customer");
const sallerService = require("../services/sallers");
const requireLogin = async (req, res, next) => {
  try {
    if (req.headers.authorization) {
      const token = req.headers.authorization.split(" ")[1];

      const { success, payload } = authService.verifyToken(token);
      if (!success) {
        logger.debug(`[requireLogin] ${payload}`);
        return res.status(httpResponses.HTTP_STATUS_UNAUTHORIZED).json({
          success: false,
          message: payload,
        });
      }
      const user = payload;
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
              message: `${httpResponses.CUSTOMER_NOT_FOUND}`,
            });
          }
          req.session.customer = customer;
          break;
        case enums.UserRole.SALLER:
          const saller = await sallerService.getOneSallerByFilter({
            user: user._id,
          });
          if (!saller) {
            logger.debug(
              `[requireLogin]: find customer by user id -> ${httpResponses.SALLER_NOT_FOUND}`
            );
            return res.status(httpResponses.HTTP_STATUS_UNAUTHORIZED).json({
              success: false,
              message: `${httpResponses.SALLER_NOT_FOUND}`,
            });
          }
          req.session.saller = saller;
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
      logger.debug(
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

const checkLogin = async (req, res, next) => {
  try {
    if (req.headers.authorization) {
      const token = req.headers.authorization.split(" ")[1];

      const user = authService.verifyToken(token);
      logger.info(`[checkLogin]: user -> ${JSON.stringify(user)}`);

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
              message: `${httpResponses.CUSTOMER_NOT_FOUND}`,
            });
          }
          req.session.customer = customer;
          break;
        case enums.UserRole.SALLER:
          const saller = await sallerService.getOneSallerByFilter({
            user: user._id,
          });
          if (!saller) {
            logger.debug(
              `[requireLogin]: find customer by user id -> ${httpResponses.SALLER_NOT_FOUND}`
            );
            return res.status(httpResponses.HTTP_STATUS_UNAUTHORIZED).json({
              success: false,
              message: `${httpResponses.SALLER_NOT_FOUND}`,
            });
          }
          req.session.saller = saller;
          break;
        default:
          break;
      }
      logger.info(`[checkLogin]: ${JSON.stringify(user)}`);
      next();
    } else {
      logger.debug(`[checkLogin]: not token -> ${httpResponses.SUCCESS}`);
      next();
    }
  } catch (error) {
    logger.error(`[checkLogin]: error -> ${error.message}`);
    return res
      .status(httpResponses.HTTP_STATUS_INTERNAL_ERROR)
      .json({ success: false, message: `Error: ${error.message}` });
  }
};

module.exports = {
  checkPermissions,
  requireLogin,
  checkLogin,
};
