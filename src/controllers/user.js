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

//
const getAllUsers = async (req, res) => {
  try {
    const { user } = req.session;
    logger.debug(`[getAllUsers] -> ${JSON.stringify(user)}`);
    const users = await userService.getAllUsers();
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

const paymentWithMomo = async (req, res) => {
  try {
    const token = authService.generateToken60S({ userName: "hoaquason" });

    const redirect = `${constants.REDIRECT_URL_MOMO}/${JSON.stringify(token)}`;
    console.log("momo");
    const body = await paymentMomoService.paymentMomo(100000, redirect);
    console.log(body);
    if (!body.payUrl) {
      return res.status(404).json(body);
    }

    return res.redirect(body.payUrl);
  } catch (err) {
    logger.error(`[paymentWithMomo] error -> ${err.message}`);
    res.status(400).json({ message: err.message });
  }
};

const paymentWithMomoReturn = async (req, res) => {
  try {
    res.json("oki");
  } catch (err) {
    logger.error(`[paymentWithMomo] error -> ${err.message}`);
    res.status(400).json({ message: err.message });
  }
};

const signUp = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      logger.debug(`[signUp] ->${httpResponses.INFOR_INVALID}`);
      return res.badRequest(httpResponses.INFOR_INVALID);
    }

    const existUser = await userService.getOneUserByFilter({
      email: email.toLowerCase(),
    });

    if (existUser) {
      logger.debug(`[signUp] ->${httpResponses.EMAIL_ALREADY_EXISTS}`);
      return res.badRequest(httpResponses.EMAIL_ALREADY_EXISTS);
    }

    const hashPassword = securityService.hashPassword(password);

    const newUser = { email: email.toLowerCase(), password: hashPassword };
    await userService.createUser(newUser);

    logger.debug(`[signUp] ->${httpResponses.USER_CREATE_SUCCESSFULLY}`);

    res.created(httpResponses.USER_CREATE_SUCCESSFULLY);
  } catch (err) {
    logger.error(`[sign-up] ->${err.message}`);
    return res.internalServer(err.message);
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
  paymentWithMomo,
  paymentWithMomoReturn,
  signUp,
  login,
};
