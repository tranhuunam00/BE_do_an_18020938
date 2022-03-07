const logger = require("../utils/logger");
const constants = require("../constants/constants");
const https = require("https");
const momoHelper = require("../helpers/momo");

var partnerCode = process.env.PARTNER_CODE || "MOMOXQX320220222";
var accessKey = process.env.ACCESS_KEY || "NSHbkxIc8kM3XXHh";
var requestId = partnerCode + new Date().getTime();
var orderId = requestId;
var orderInfo = constants.ORDER_INFO_MOMO || "pay with MoMo";
// var redirectUrl =
//   constants.REDIRECT_URL_MOMO || "http://localhost:5002/api/users/momoReturn";
var ipnUrl =
  constants.REDIRECT_URL_MOMO || "http://localhost:5002/api/users/momoReturn";
// var ipnUrl = redirectUrl = "https://webhook.site/454e7b77-f177-4ece-8236-ddf1c26ba7f8";
// var amount = "45000";
var requestType = constants.REQUEST_TYPE_MOMO || "captureWallet";
// var requestType = "payWithATM";

var extraData = ""; //pass empty value if your merchant does not have stores

const paymentMomo = async (amount, redirectUrl) => {
  try {
    const url = await new Promise((resolve, reject) => {
      var rawSignature =
        "accessKey=" +
        accessKey +
        "&amount=" +
        amount +
        "&extraData=" +
        extraData +
        "&ipnUrl=" +
        ipnUrl +
        "&orderId=" +
        orderId +
        "&orderInfo=" +
        orderInfo +
        "&partnerCode=" +
        partnerCode +
        "&redirectUrl=" +
        redirectUrl +
        "&requestId=" +
        requestId +
        "&requestType=" +
        requestType;

      const signature = momoHelper.createHash(rawSignature);

      console.log("hiih");
      const requestBody = JSON.stringify({
        partnerCode: partnerCode,
        accessKey: accessKey,
        requestId: requestId,
        amount: amount,
        orderId: orderId,
        orderInfo: orderInfo,
        redirectUrl: redirectUrl,
        ipnUrl: ipnUrl,
        extraData: extraData,
        requestType: requestType,
        signature: signature,
        lang: "vi",
      });

      const options = {
        hostname: "test-payment.momo.vn",
        port: 443,
        path: "/v2/gateway/api/create",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Content-Length": Buffer.byteLength(requestBody),
        },
      };

      const req = https.request(options, (res) => {
        logger.info(`Status: ${res.statusCode}`);
        logger.info(`Headers: ${JSON.stringify(res.headers)}`);
        res.setEncoding("utf8");

        res.on("data", (body) => {
          console.log(body);

          return resolve(JSON.parse(body));
        });
        res.on("end", () => {
          logger.debug("No more data in response.");
          // return reject("");
        });
      });

      req.on("error", (e) => {
        logger.error(`problem with request: ${e.message}`);
        reject("");
      });

      req.write(requestBody);
      req.end();
    });

    return url;
  } catch (err) {
    return "";
  }
};

module.exports = { paymentMomo };
