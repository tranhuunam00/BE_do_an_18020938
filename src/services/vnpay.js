const moment = require("moment");
const querystring = require("qs");
const crypto = require("crypto");

function sortObject(obj) {
  var sorted = {};
  var str = [];
  var key;
  for (key in obj) {
    if (obj.hasOwnProperty(key)) {
      str.push(encodeURIComponent(key));
    }
  }
  str.sort();
  for (key = 0; key < str.length; key++) {
    sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
  }
  return sorted;
}

const createPaymentVnPay = (data) => {
  var ipAddr = process.env.BE_ENDPOINT;
  var vnp_Params = {};
  var tmnCode = process.env.VNP_TMN_CODE;
  var secretKey = process.env.VNP_HASH_SECRET;
  var vnpUrl = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";
  var returnUrl = "http://localhost:8888/order/vnpay_return";
  if (data.language === null || data.language === "") {
    data.language = "vn";
  }
  vnp_Params["vnp_Version"] = "2.1.0";
  vnp_Params["vnp_Command"] = "pay";
  vnp_Params["vnp_TmnCode"] = tmnCode;
  // vnp_Params['vnp_Merchant'] = ''
  vnp_Params["vnp_Locale"] = data.language;
  vnp_Params["vnp_CurrCode"] = "VND";
  vnp_Params["vnp_TxnRef"] = moment().format("hhmmss");
  vnp_Params["vnp_OrderInfo"] = data.orderDescription;
  vnp_Params["vnp_OrderType"] = data.orderType;
  vnp_Params["vnp_Amount"] = data.amount * 100;
  vnp_Params["vnp_ReturnUrl"] = returnUrl;
  vnp_Params["vnp_IpAddr"] = ipAddr;
  vnp_Params["vnp_CreateDate"] = moment().format("YYYYMMDDhhmmss");
  if (data.bankCode !== null && data.bankCode !== "") {
    vnp_Params["vnp_BankCode"] = data.bankCode;
  }

  vnp_Params = sortObject(vnp_Params);

  var signData = querystring.stringify(vnp_Params, { encode: false });
  var hmac = crypto.createHmac("sha512", secretKey);
  var signed = hmac.update(new Buffer.from(signData, "utf-8")).digest("hex");
  vnp_Params["vnp_SecureHash"] = signed;
  vnpUrl += "?" + querystring.stringify(vnp_Params, { encode: false });

  return vnpUrl;
};

const url = createPaymentVnPay({
  orderType: "billpayment",
  amount: "10000",
  orderDescription: "qua ghe lun",
  bankCode: "",
  language: "vn",
});

console.log(url);

module.exports = { createPaymentVnPay };
