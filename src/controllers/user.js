const userService = require("../services/user");
const pdfHelper = require("../helpers/pdf/pdfmake");
const contentDisposition = require("content-disposition");
const path = require("path");
const pdf = require("../helpers/pdf/pdf");

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

module.exports = {
  getAllUsers,
  getAllUsersExportPdf,
};
