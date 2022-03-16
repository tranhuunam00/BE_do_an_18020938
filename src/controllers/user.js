const pdf = require("../helpers/pdf/pdf");
const logger = require("../utils/logger");
const httpResponses = require("../utils/httpResponses");

//
const templateHelper = require("../helpers/template");
const mailerHelper = require("../helpers/mailer");
const constants = require("../constants/constants");
const generatePdfPuppeteer = require("../helpers/generate_Pdf_puppeteer");
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

module.exports = {
  getAllUsers,
  getAllUsersExportPdf,
  sendMail,
  login,
  getAllUsersExportPdfByPuppeteer,
};
