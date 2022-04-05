module.exports.SALT_ROUND = 10;
module.exports.EXPIRES_IN = 60 * 10;
module.exports.EXPIRES_IN_5MIN = 60 * 5;

module.exports.EMAIL_VERIFY_CODE_LENGTH = 50;
module.exports.EMAIL_VERIFY_CODE_TYPE = "url-safe";

module.exports.PHONE_VERIFY_CODE_LENGTH = 4;
module.exports.PHONE_VERIFY_CODE_TYPE = "number";

module.exports.FILE_MAX_SIZE = 10 * 1024 * 1024;
module.exports.ERR_CODE = {
  LIMIT_FILE_SIZE: "LIMIT_FILE_SIZE",
};

//#region Pagination
module.exports.PAGINATION_DEFAULT_PAGE = 1;
module.exports.PAGINATION_DEFAULT_LIMIT = 10;
//#endregion Pagination

//#region Character Special
module.exports.CHAR_COMMA = ",";
//#endregion Character Special

//#region Time
module.exports.DAY_OF_WEEKS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

module.exports.PRODUCT_PRICE_DEFAULT = 1;
module.exports.PRODUCT_AMOUNT_DEFAULT = 1;
module.exports.DATE_TIME_FORMAT = "yyyy-MM-DD HH:mm";
module.exports.DATE_FORMAT = "yyyy-MM-DD";
module.exports.DATE_FORMAT_AGGREGATE = "%Y-%m-%d";

//Mail
module.exports.MAILER = {
  SENDGRID_API_KEY: process.env.SENDGRID_API_KEY,
};

//GOOGLE DRIVE
module.exports.FOLDER_FILE_GOOGLR_DRIVE = "Picture";

//MOMO
module.exports.REDIRECT_URL_MOMO =
  "http://localhost:5003/api/customers/return-momo-payment";
module.exports.ORDER_INFO_MOMO = "payment with Momo";
module.exports.REQUEST_TYPE_MOMO = "captureWallet";

// CALENDER

module.exports.CALENDER_CLIENT_KEY = process.env.CALENDER_CLIENT_KEY;
module.exports.CALENDER_SECRET_KEY = process.env.CALENDER_SECRET_KEY;
module.exports.CALENDER_REDIRECT_URI = process.env.CALENDER_REDIRECT_URI;

module.exports.FE_LOGIN = `${process.env.FE_ENDPOINT}/login`;

module.exports.FE_RESET_PASSWORD = `${process.env.FE_ENDPOINT}/reset-password`;

module.exports.BE_ENDPOINT =
  process.env.BE_ENDPOINT || "http://localhost:5003/api";

module.exports.RETURN_NOTIFY = process.env.FE_ENDPOINT;

(module.exports.AVATAR_DEFAULT =
  "http://drive.google.com/uc?export=view&id=1WFK_l1Ww34zrqwbrN7Nq5XBLpqzS1pGQ"),
  (module.exports.COVER_DEFAULT =
    "http://drive.google.com/uc?export=view&id=1C_NsCEZlpWPBgIwlXrtAe4YA4MHh76xX");
