const logger = require("../utils/logger");
const httpResponses = require("../utils/httpResponses");

const sendGridMail = require("@sendgrid/mail");
const { MAILER } = require("../constants/constants");

const sendGmail = async (mail) => {
  try {
    sendGridMail.setApiKey(
      process.env.SENDGRID_API_KEY ||
        "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"
    );

    const response = await sendGridMail.send(mail);
    logger.info(`[mailer] sendMail -> ${JSON.stringify(response)}`);
    return {
      success: true,
      message: `${httpResponses.SUCCESS}`,
    };
  } catch (error) {
    logger.error(`[mailer] sendMail -> ${JSON.stringify(error.response.body)}`);
    return {
      success: false,
      message: `${httpResponses.SEND_EMAIL_FAIL}`,
    };
  }
};

module.exports = { sendGmail };
