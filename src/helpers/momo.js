var secretkey = process.env.SECRET_KEY;
const crypto = require("crypto");

const createHash = (data) => {
  const hash = crypto
    .createHmac("sha256", secretkey)
    .update(data)
    .digest("hex");

  return hash;
};

module.exports = { createHash };
