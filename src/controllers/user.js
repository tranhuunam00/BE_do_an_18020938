const userService = require("../services/user");
const pdf = require("../helpers/pdf/pdf");
const logger = require("../utils/logger");
const httpResponses = require("../utils/httpResponses");
const templateHelper = require("../helpers/template");
const mailerHelper = require("../helpers/mailer");
const getAllUsers = async (req, res) => {
  try {
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

module.exports = {
  getAllUsers,
  getAllUsersExportPdf,
  sendMail,
};
