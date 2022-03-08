const pdf = require("../helpers/pdf/pdf");
const logger = require("../utils/logger");
const httpResponses = require("../utils/httpResponses");

//
const templateHelper = require("../helpers/template");
const mailerHelper = require("../helpers/mailer");
const constants = require("../constants/constants");
//
const authService = require("../services/auth");
const userService = require("../services/user");
const securityService = require("../services/security");
const paymentMomoService = require("../services/momo");
const customerService = require("../services/customer");

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
    const users = await userService.getAllUsers();
    const filePath = await pdf.createPdf(users, "Danh sách người dùng");
    return res.json(filePath);
  } catch (err) {
    return res.json(err);
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
    console.log(existedUser);
    if (!existedUser) {
      logger.debug(`[login] ->${httpResponses.USER_NOT_FOUND}`);
      return res.notFound(httpResponses.USER_NOT_FOUND);
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

    const token = authService.generateToken({
      _id: existedUser._id,
      role: existedUser.role,
    });

    logger.debug(`[login] ->${httpResponses.SUCCESS}`);
    return res.ok(httpResponses.SUCCESS, { user, token });
  } catch (err) {
    logger.error(`[login] ->${err.message}`);
    return res.internalServer(err.message);
  }
};
module.exports = {
  getAllUsers,
  getAllUsersExportPdf,
  sendMail,
  login,
};
