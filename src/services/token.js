const Token = require("../models/token");

const getAllTokensByFilter = async (filter) => {
  return await Token.find(filter);
};

const createToken = async (token) => {
  const newToken = new Token(token);
  return await newToken.save();
};

const getOneTokenByFilter = async (filter) => {
  return await Token.findOne(filter);
};

const getTokenByFilter = async (filter) => {
  return await Token.findOne(filter);
};

const deleteTokenByFilter = async (filter) => {
  return await Token.deleteOne(filter);
};

const updateTokenByFilter = async (filter, tokenUpdate) => {
  return await Token.findOneAndUpdate(filter, tokenUpdate);
};
module.exports = {
  getAllTokensByFilter,
  createToken,
  getOneTokenByFilter,
  getTokenByFilter,

  deleteTokenByFilter,
  updateTokenByFilter,
};
