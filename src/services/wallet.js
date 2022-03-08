const Wallet = require("../models/wallet");

const createWallet = async (newModel) => {
  const newWallet = new Wallet(newModel);
  return await newWallet.save();
};

const getOneWalletByFilter = async (filter) => {
  return await Wallet.findOne(filter);
};

const updateOneWalletByFilter = async (filter, newModel) => {
  return await Wallet.updateOne(filter, newModel);
};

const getOneAndUpdateWalletByFilter = async (filter, newModel) => {
  return await Wallet.findByIdAndUpdate(filter, newModel);
};

module.exports = {
  createWallet,
  getOneWalletByFilter,
  updateOneWalletByFilter,
  getOneAndUpdateWalletByFilter,
};
