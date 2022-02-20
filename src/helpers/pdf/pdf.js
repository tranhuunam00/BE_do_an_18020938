const options = require("./option");
const fs = require("fs");
const pdf = require("pdf-creator-node");
const path = require("path");

const createPdf = async (data, nameTitle) => {
  try {
    const html = fs.readFileSync(
      path.join(__dirname, "../../../public/table.html"),
      "utf-8"
    );
    const filename = Date.now().toString() + ".pdf";
    let arrayUser = [];
    console.log(Object.keys(data));
    // console.log(data);
    data.forEach((d) => {
      const prod = {
        name: d.name,
        age: d.age,
      };
      arrayUser.push(prod);
    });
    const obj = {
      userList: arrayUser,
      nameTitle: nameTitle,
    };
    const document = {
      html: html,
      data: {
        user: obj,
      },
      path: "./public/docs/" + filename,
    };
    const done = await pdf
      .create(document, options)
      .then((res) => {
        console.log(res);
      })
      .catch((error) => {
        console.log(error);
      });

    return filename;
  } catch (err) {
    console.log(err);
    return "";
  }
};
module.exports = { createPdf };
