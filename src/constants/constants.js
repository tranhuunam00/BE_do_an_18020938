module.exports.SALT_ROUND = 10;
module.exports.EXPIRES_IN = 365 * 24 * 60 * 60;

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
module.exports.DATE_TIME_FORMAT = "yyyy-MM-DD HH:mm";
module.exports.DATE_FORMAT = "yyyy-MM-DD";
module.exports.DATE_FORMAT_AGGREGATE = "%Y-%m-%d";

//#endregion Time

// Query day
// module.exports.DAY_FILTER = {
//   MONDAY
// }

module.exports.PRICE_FILTER = {
  LT10: { $lt: 10 },
  GTE10_LTE25: {
    $and: [{ $gte: 10 }, { $lte: 25 }],
  },
  GT25: { $gt: 25 },
};
