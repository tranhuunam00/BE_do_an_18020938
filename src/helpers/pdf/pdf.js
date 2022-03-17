const options = require("./option");
const fs = require("fs");
const pdf = require("pdf-creator-node");
const path = require("path");
const logger = require("../../utils/logger");

const createPdf = async (data, nameTitle) => {
  try {
    const html = fs.readFileSync(
      path.join(__dirname, "../../../public/table.html"),
      "utf-8"
    );

    const document = {
      html: html,
      data: {
        user: { name: "nam" },
      },
      // path: "./public/docs/" + filename,
      type: "buffer",
    };

    const done = await new Promise((resolve, reject) => {
      pdf
        .create(document, options)
        .then((res) => {
          resolve(res);
        })
        .catch((error) => {
          reject(false);
        });
    });

    return done;
  } catch (err) {
    logger.error[`createPdf  ${err.message}`];
    return false;
  }
};
module.exports = { createPdf };
