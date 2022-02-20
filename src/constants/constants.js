module.exports.SALT_ROUND = 10;
module.exports.EXPIRES_IN = 365 * 24 * 60 * 60;

module.exports.EMAIL_VERIFY_CODE_LENGTH = 50;
module.exports.EMAIL_VERIFY_CODE_TYPE = 'url-safe';

module.exports.PHONE_VERIFY_CODE_LENGTH = 4;
module.exports.PHONE_VERIFY_CODE_TYPE = 'number';

module.exports.MAILER = {
  SENDGRID_API_KEY: process.env.SENDGRID_API_KEY,
};

// GCP
module.exports.GCP = {
  GCS_BUCKET_NAME: process.env.GCS_BUCKET_NAME,
  GCP_SECRET_KEY: process.env.GCP_SECRET_KEY_FILE,
  GCP_STORAGE_URL: process.env.GCP_STORAGE_URL,
};

// Google API
module.exports.GOOGLE_API = {
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET_KEY: process.env.GOOGLE_CLIENT_SECRET_KEY,
};

// Vonage Api
module.exports.VONAGE = {
  API_KEY: process.env.VONAGE_API_KEY,
  API_SECRET_KEY: process.env.VONAGE_API_SECRET_KEY,
  SEND_MESSAGE_FROM: process.env.VONAGE_SEND_MESSAGE_FROM,
};

module.exports.FILE_MAX_SIZE = 10 * 1024 * 1024;
module.exports.ERR_CODE = {
  LIMIT_FILE_SIZE: 'LIMIT_FILE_SIZE',
};

//#region Pagination
module.exports.PAGINATION_DEFAULT_PAGE = 1;
module.exports.PAGINATION_DEFAULT_LIMIT = 10;
//#endregion Pagination

//#region Character Special
module.exports.CHAR_COMMA = ',';
//#endregion Character Special

//#region Time
module.exports.DAY_OF_WEEKS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
module.exports.DATE_TIME_FORMAT = 'yyyy-MM-DD HH:mm';
module.exports.DATE_FORMAT = 'yyyy-MM-DD';
module.exports.DATE_FORMAT_AGGREGATE = '%Y-%m-%d';

//#endregion Time

//#region Calendar
module.exports.CALENDAR = {
  CLIENT_ID: process.env.CALENDAR_CLIENT_ID,
  CLIENT_SECRET: process.env.CALENDAR_CLIENT_SECRET,
  REDIRECT_URL: process.env.CALENDAR_REDIRECT_URL,
};
//#endregion Calendar

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
