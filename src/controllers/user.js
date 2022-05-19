const pdf = require("../helpers/pdf/pdf");
const logger = require("../utils/logger");
const httpResponses = require("../utils/httpResponses");
const passport = require("passport");
const enums = require("../constants/enum");
//
const templateHelper = require("../helpers/template");
const mailerHelper = require("../helpers/mailer");
const constants = require("../constants/constants");
const generatePdfPuppeteer = require("../helpers/generate_Pdf_puppeteer");
const generatePdfByHtml = require("../helpers/pdf/pdfByHtml");
//
const authService = require("../services/auth");
const userService = require("../services/user");
const securityService = require("../services/security");
const paymentMomoService = require("../services/momo");
const customerService = require("../services/customer");

const googleDriveService = require("./../services/googleDriveService");
const sallerService = require("./../services/sallers");
const tokenService = require("./../services/token");
//
const getAllUsers = async (req, res) => {
  try {
    const { user } = req.session;
    logger.debug(`[getAllUsers] -> ${JSON.stringify(user)}`);
    const users = await userService.getAllUsersByFilter();
    res.status(200).json(users);
  } catch (err) {
    res.status(400).send(err.message);
  }
};

const getAllUsersExportPdf = async (req, res) => {
  try {
    logger.debug(`[getAllUsersExportPdf]`);
    const users = await userService.getAllUsersByFilter();
    const data = await pdf.createPdf(users, "Danh sách người dùng");
    if (!data) {
      logger.debug([`getAllUsersExportPdf data ->false`]);
      return res.badRequest(`data ->false`);
    }
    res.setHeader("Content-Length", data.length);
    res.setHeader("Content-Type", "application/pdf");
    return res.status(httpResponses.HTTP_STATUS_OK).send(data);
  } catch (err) {
    logger.error(err.message);
    return res.internalServer(err.message);
  }
};

const sendMail = async (req, res) => {
  try {
    const { subject, body } = req.body;
    console.log(subject);
    const template = templateHelper.sendMailForTutor(
      "nam oi",
      "that la hay hay hay",
      "18020938@vnu.edu.vn"
    );
    await mailerHelper.sendGmail(template);

    return res.status(httpResponses.HTTP_STATUS_OK).json({
      success: true,
      message: `${httpResponses.SEND_MAIL_SUCCESS}`,
    });
  } catch (err) {
    logger.error(`[sendMailForTutor] error -> ${err.message}`);
    res.status(httpResponses.HTTP_STATUS_INTERNAL_ERROR).json({
      success: false,
      message: `${err.message}`,
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(email);
    if (!email || !password) {
      logger.debug(`[login] ->${httpResponses.INFOR_INVALID}`);
      return res.badRequest(httpResponses.INFOR_INVALID);
    }

    const existedUser = await userService.getOneUserByFilter({
      email,
    });

    if (!existedUser) {
      logger.debug(`[login] ->${httpResponses.USER_NOT_FOUND}`);
      return res.notFound(httpResponses.USER_NOT_FOUND);
    }

    if (!existedUser.isConfirm) {
      logger.debug(`[login] ->${httpResponses.USER_NOT_CONFIRM}`);
      return res.notFound(httpResponses.USER_NOT_CONFIRM);
    }

    const isComparedPassword = securityService.comparePassword(
      password,
      existedUser.password
    );

    logger.debug(`[login] comparePass->${httpResponses.SUCCESS}`);

    if (!isComparedPassword) {
      logger.debug(`[login] ->${httpResponses.PASSWORD_NOT_MATCH}`);
      return res.badRequest(httpResponses.PASSWORD_NOT_MATCH);
    }
    let user = {
      _id: existedUser._id,
      role: existedUser.role,
      email: existedUser.email,
    };
    switch (existedUser.role) {
      case enums.UserRole.CUSTOMER:
        const customer = await customerService.getOneCustomerByFilter({
          user: existedUser._id,
        });
        user.lastName = customer.lastName;
        user.firstName = customer.firstName;
        user.avatarUrl = customer.avatarUrl;
        user.gender = customer.gender;
        user.description = customer.description;
        user.dob = customer.dob;
        user.customerId = customer._id;
        break;
      case enums.UserRole.SALLER:
        const saller = await sallerService.getOneSallerByFilter({
          user: existedUser._id,
        });
        user.lastName = saller.lastName;
        user.firstName = saller.firstName;
        user.avatarUrl = saller.avatarUrl;
        user.gender = saller.gender;
        user.description = saller.description;
        user.dob = saller.dob;
        user.sallerId = saller._id;

        break;
    }

    const token = authService.generateToken({
      _id: existedUser._id,
      role: existedUser.role,
    });

    const refreshToken = authService.generateRefreshToken({
      _id: existedUser._id,
      token: token,
    });

    await tokenService.createToken({
      user: existedUser._id,
      accessToken: token,
      refreshToken,
    });

    logger.debug(`[login] ->${httpResponses.SUCCESS}`);
    return res.ok(httpResponses.SUCCESS, {
      user,
      token,
      refreshToken,
    });
  } catch (err) {
    logger.error(`[login] ->${err.message}`);
    return res.internalServer(err.message);
  }
};

const getAllUsersExportPdfByPuppeteer = async (req, res) => {
  try {
    logger.debug(`[getAllUsersExportPdfByPuppeteer]`);
    const users = await userService.getAllUsersByFilter();
    console.log(users);
    const html = generatePdfPuppeteer.createHtml(users[0]);

    const pdf = await generatePdfPuppeteer.pdfPuppeteer(html);
    if (!pdf) {
      return res.badRequest(`exxport pdf error`);
    }
    if (!pdf) {
      logger.debug([`getAllUsersExportPdfByPuppeteer data ->false`]);
      return res.badRequest(`data ->false`);
    }
    res.setHeader("Content-Length", pdf.length);
    res.setHeader("Content-Type", "application/pdf");

    return res.status(httpResponses.HTTP_STATUS_OK).send(pdf);
  } catch (err) {
    logger.error(err.message);
    return res.internalServer(err.message);
  }
};

const exportByHtml = async (req, res) => {
  try {
    logger.debug(`[exportByHtml]`);
    const users = await userService.getAllUsersByFilter();
    const data = await generatePdfByHtml.createPdfHtml();
    if (!data) {
      logger.debug([`exportByHtml data ->false`]);
      return res.badRequest(`data ->false`);
    }
    res.setHeader("Content-Length", data.length);
    res.setHeader("Content-Type", "application/pdf");
    return res.status(httpResponses.HTTP_STATUS_OK).send(data);
  } catch (err) {
    logger.error(err.message);
    return res.internalServer(err.message);
  }
};
/*
  register
*/
const register = async (req, res) => {
  try {
    const newModel = req.body;
    console.log(newModel);
    if (!newModel.role) {
      newModel.role = enums.UserRole.CUSTOMER;
    }
    logger.debug(`[register] running`);
    let avatar;
    if (req.files && req.files.avatar && req.files.avatar.length > 0) {
      avatar = req.files.avatar[0];
    }
    logger.info(`[register] body -> ${JSON.stringify(newModel)}`);
    if (!newModel.email) {
      logger.debug(`[register] error - >${httpResponses.EMAIL_NOT_FOUND}`);
      return res.notFound(httpResponses.EMAIL_NOT_FOUND);
    }
    if (!newModel.password) {
      logger.debug(`[register] error - >${httpResponses.PASSWORD_NOT_FOUND}`);
      return res.notFound(httpResponses.PASSWORD_NOT_FOUND);
    }
    if (
      !newModel.firstName ||
      !newModel.lastName ||
      !newModel.dob ||
      !newModel.gender
    ) {
      logger.debug(`[register] error - >${httpResponses.QUERY_INVALID}`);
      return res.notFound(httpResponses.QUERY_INVALID);
    }
    console.log("oki");
    const existedUser = await userService.getUserByFilter({
      email: newModel.email,
    });
    if (existedUser && existedUser.isConfirm) {
      logger.debug(`[register] error - >${httpResponses.USER_EXISTED}`);

      return res.badRequest(httpResponses.USER_EXISTED);
    }
    if (existedUser) {
      switch (existedUser.role) {
        case enums.UserRole.CUSTOMER: {
          console.log("Đã xóa");
          await customerService.deleteCustomer({ user: existedUser._id });
          break;
        }
        case enums.UserRole.SALLER: {
          await sallerService.deleteSaller({ user: existedUser._id });
          break;
        }
      }
      logger.debug(`[createUser] delete old`);
    }
    await userService.deleteUsersByFilter({ email: newModel.email });

    const hashPassword = securityService.hashPassword(newModel.password);
    newModel.password = hashPassword;
    const newUser = await userService.createUser(newModel);
    if (avatar) {
      console.log(avatar);
      const avatarUrl = await googleDriveService.uploadGgDrive(avatar);
      newModel.avatarUrl = avatarUrl;
    }
    newModel.user = newUser._id;
    switch (newModel.role) {
      case enums.UserRole.CUSTOMER:
        await customerService.createCustomer(newModel);
        logger.debug(`[createUser] createCustomer ${httpResponses.SUCCESS}`);

        break;
      case enums.UserRole.SALLER:
        await sallerService.createSaller(newModel);
        logger.debug(`[createUser] createSaller ${httpResponses.SUCCESS}`);
        break;
      default:
      // code block
    }

    const token = authService.generateToken5Min({
      _id: newUser._id,
      type: "register",
    });
    const template = templateHelper.sendMailCreateUser(token, newModel.email);
    const { success } = await mailerHelper.sendGmail(template);
    if (!success) {
      logger.debug(`[register] error - >${httpResponses.SEND_MAIL_ERROR}`);
      return res.badRequest(httpResponses.SEND_MAIL_ERROR);
    }

    logger.debug(`[register] - >${httpResponses.SEND_MAIL_SUCCESS}`);
    return res.created(httpResponses.SUCCESS);
  } catch (err) {
    logger.debug(`[register] error - >${err.message}`);
    return res.internalServer(err.message);
  }
};

// ****************************************************************
const confirmRegister = async (req, res) => {
  try {
    const { token } = req.query;
    logger.info(`[confirmRegister] token-> ${token}`);
    if (!token) {
      logger.debug(`[confirmRegister]  - >${httpResponses.TOKEN_NOT_FOUND}`);
      return res.notFound(httpResponses.TOKEN_NOT_FOUND);
    }

    const { success, payload } = authService.verifyToken(token);
    if (!success) {
      logger.debug(`[confirmRegister]  - >${payload}`);
      return res.status(httpResponses.HTTP_STATUS_UNAUTHORIZED).json({
        success: false,
        message: payload,
      });
    }

    if (!payload || payload.type != "register") {
      logger.debug(`[confirmRegister]  - >${httpResponses.TOKEN_NOT_VERIFIED}`);
      return res.badRequest(httpResponses.TOKEN_NOT_VERIFIED);
    }

    logger.info(`[confirmRegister] payload - >${JSON.stringify(payload)}`);

    const existedUser = await userService.updateUserByFilter(
      { _id: payload._id },
      { isConfirm: true }
    );
    if (!existedUser) {
      logger.debug(`[confirmRegister]  - >${httpResponses.USER_NOT_FOUND}`);
      return res.notFound(httpResponses.USER_NOT_FOUND);
    }

    logger.debug(`[confirmRegister] - >${httpResponses.SUCCESS}`);
    return res
      .status(httpResponses.HTTP_STATUS_OK)
      .redirect(constants.FE_LOGIN);
  } catch (err) {
    logger.debug(`[confirmRegister] error - >${err.message}`);
    return res.internalServer(err.message);
  }
};
/*
 **
 * forgot Password
 * @param {*} req
 * @param {*} res
 */
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    logger.info(`[forgotPassword]: email -> ${email}`);
    const user = await userService.getUserByFilter({ email, isConfirm: true });
    if (!user) {
      logger.debug(
        `[forgotPassword]: getUserByEmail -> ${httpResponses.USER_NOT_FOUND}`
      );
      return res.badRequest(httpResponses.USER_NOT_FOUND);
    }

    const token = authService.generateToken5Min({
      email: user.email,
      type: "forgot_password",
    });

    const temp = templateHelper.sendMailForgotPassword(token, email);

    const sendDone = await mailerHelper.sendGmail(temp);

    const { success } = sendDone;

    if (!success) {
      logger.debug(
        `[forgotPassword] sendMail ->${httpResponses.SEND_MAIL_ERROR}`
      );
      return res.badRequest(httpResponses.SEND_MAIL_ERROR);
    }

    return res.ok(httpResponses.SUCCESS);
  } catch (err) {
    logger.error(`[forgotPassword]: error -> ${err.message}`);
    res.status(httpResponses.HTTP_STATUS_INTERNAL_ERROR).json({
      success: false,
      message: `${err.message}`,
    });
  }
};

/**
 * Reset password
 * @param {*} req
 * @param {*} res
 */
const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    logger.info(`[resetPassword]: token -> ${token}`);

    const { success, payload } = authService.verifyToken(token);
    if (!success) {
      logger.debug(`[resetPassword]  - >${payload}`);
      return res.status(httpResponses.HTTP_STATUS_UNAUTHORIZED).json({
        success: false,
        message: payload,
      });
    }

    if (!newPassword) {
      logger.debug(`[resetPassword]  - >${httpResponses.PASSWORD_NOT_FOUND}`);
      return res.notFound(httpResponses.PASSWORD_NOT_FOUND);
    }
    if (!payload || payload.type != "forgot_password") {
      logger.debug(`[resetPassword]  - >${httpResponses.TOKEN_NOT_VERIFIED}`);
      return res.badRequest(httpResponses.TOKEN_NOT_VERIFIED);
    }
    const user = await userService.getUserByFilter({
      email: payload.email,
      isConfirm: true,
    });

    if (!user) {
      logger.debug(
        `[resetPassword]: getUserByEmail -> ${httpResponses.USER_NOT_FOUND}`
      );
      return res.badRequest(httpResponses.USER_NOT_FOUND);
    }

    const hashPassword = securityService.hashPassword(newPassword);

    await userService.updateUserByFilter(
      { _id: user._id },
      { password: hashPassword }
    );

    return res.ok(httpResponses.SUCCESS);
  } catch (err) {
    logger.error(`[forgotPassword]: error -> ${err.message}`);
    return res.status(httpResponses.HTTP_STATUS_INTERNAL_ERROR).json({
      success: false,
      message: `${err.message}`,
    });
  }
};

//
//

/*
refresh Token
*/

const refreshToken = async (req, res) => {
  try {
    const { token, refreshToken, userId } = req.body;

    const existedUser = await userService.getUserByFilter({ _id: userId });

    if (!existedUser) {
      logger.debug(`[refreshToken] ${httpResponses.USER_NOT_FOUND}`);
      return res.notFound(httpResponses.USER_NOT_FOUND);
    }
    logger.debug("[refreshToken] running");
    const existToken = await tokenService.getTokenByFilter({
      accessToken: token,
      refreshToken,
      user: userId,
    });

    if (!existToken) {
      logger.debug(`[refreshToken] ${httpResponses.TOKEN_NOT_FOUND}`);
      return res.notFound(httpResponses.TOKEN_NOT_FOUND);
    }

    const verifyAccessToken = authService.verifyRefreshToken(refreshToken);

    const newAccessToken = authService.generateToken({
      _id: existedUser._id,
      role: existedUser.role,
    });
    const newRefreshToken = authService.generateRefreshToken({
      token: newAccessToken,
      _id: existedUser._id,
    });

    await tokenService.deleteTokenByFilter({ _id: existToken._id });
    await tokenService.createToken({
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
      user: existedUser._id,
    });
    logger.debug(`[refreshToken] ${httpResponses.SUCCESS}`);
    res.ok(httpResponses.SUCCESS, {
      token: newAccessToken,
      refreshToken: newRefreshToken,
    });
  } catch (err) {
    logger.error(`${err.message}`);
    return res.internalServer(err.message);
  }
};

/*
update user
*/

const updateUser = async (req, res) => {
  try {
    const { user } = req.session;
    const newModel = req.body;
    logger.debug(`[updateUser] userId -> ${user._id}`);

    if (newModel.password && newModel.type == "CHANGE_PASSWORD") {
      logger.debug(`[updateUser] password`);
      if (newModel.password.trim().length < 6) {
        logger.debug(`[updateUser] ${httpResponses.PASSWORD_NOT_INVALID}`);
        return res.badRequest(httpResponses.PASSWORD_NOT_INVALID);
      }
      const hashPassword = securityService.hashPassword(newModel.password);

      await userService.updateUserByFilter(
        { _id: user.id },
        { password: hashPassword }
      );
      logger.debug(`[updateUser] ${httpResponses.UPDATE_PASSWORD_SUCCESS}`);
      return res.ok(httpResponses.UPDATE_PASSWORD_SUCCESS);
    }
    logger.debug(`[updateUser] not password`);

    delete newModel.password;
    if (newModel._id) {
      delete newModel._id;
    }

    if (newModel.email) {
      delete newModel.email;
    }
    if (req.files && req.files.avatar && req.files.avatar[0]) {
      const avatarUrl = await googleDriveService.uploadGgDrive(
        req.files.avatar[0]
      );
      newModel.avatarUrl = avatarUrl;
    }
    if (req.files && req.files.cover && req.files.cover[0]) {
      const coverUrl = await googleDriveService.uploadGgDrive(
        req.files.cover[0]
      );
      newModel.coverUrl = coverUrl;
    }
    // const updateUser = await userService.updateUserByFilter(
    //   { _id: user.id },
    //   newModel
    // );
    switch (user.role) {
      case enums.UserRole.CUSTOMER: {
        logger.debug(`[updateUser] Custommer`);
        await customerService.updateCustomerByFilter(
          { user: user._id },
          newModel
        );
      }
      case enums.UserRole.SALLER: {
        logger.debug(`[updateUser] Saller`);
        await sallerService.updateSallerByFilter({ user: user._id }, newModel);
      }
      default:
    }

    logger.debug(`[updateUser] ${httpResponses.SUCCESS}`);
    return res.ok(httpResponses.SUCCESS, newModel);
  } catch (err) {
    logger.debug(`[updateUser] ${err.message}`);
    return res.internalServer(err.message);
  }
};

/*
logout
*/
const logout = async (req, res) => {
  try {
    const { token, refreshToken } = req.body;

    const existToken = await tokenService.getOneTokenByFilter({
      accessToken: token,
      refreshToken: refreshToken,
    });

    if (!existToken) {
      logger.debug(`[logout] ${httpResponses.TOKEN_NOT_FOUND}`);
      return res.ok(httpResponses.TOKEN_NOT_FOUND);
    }
    console.log(existToken);
    await tokenService.deleteTokenByFilter({ _id: existToken._id });
    logger.debug(`[logout] ${httpResponses.SUCCESS} `);
    return res.ok(httpResponses.SUCCESS);
  } catch (err) {
    logger.debug(`[logout] ${err.message}`);
    return res.internalServer(err.message);
  }
};
module.exports = {
  getAllUsers,
  getAllUsersExportPdf,
  sendMail,
  login,
  getAllUsersExportPdfByPuppeteer,
  exportByHtml,
  register,
  confirmRegister,
  forgotPassword,
  resetPassword,
  logout,
  refreshToken,
  updateUser,
};
