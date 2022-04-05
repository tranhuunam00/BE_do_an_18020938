const Saller = require("../models/saller");
const { lookup, unwind } = require("../utils/utility");
const mongoose = require("mongoose");

const getAllSallersByFilter = async (filter) => {
  return await Saller.find(filter);
};

const createSaller = async (saller) => {
  const newSaller = new Saller(saller);
  return await newSaller.save();
};

const getOneSallerByFilter = async (filter) => {
  return await Saller.findOne(filter);
};

const updateSallerByFilter = async (filter, newModel) => {
  return await Saller.findOneAndUpdate(filter, newModel);
};

const getDetailsSaller = async (sallerId) => {
  const docs = await Saller.aggregate([
    {
      $match: { _id: mongoose.Types.ObjectId(sallerId) },
    },
    lookup("users", "user", "_id", "user"),
    unwind("$user", true),
  ]);
  const res = docs && docs.length > 0 ? docs[0] : null;

  return res;
};

const getProfile = async (userId) => {
  const docs = await Saller.aggregate([
    {
      $match: { user: mongoose.Types.ObjectId(userId) },
    },
    lookup("users", "user", "_id", "user"),
    unwind("$user", true),
  ]);
  const res = docs && docs.length > 0 ? docs[0] : null;
  console.log(res);
  return res;
};

const deleteSaller = async (filter) => {
  return await Saller.deleteOne(filter);
};
module.exports = {
  getAllSallersByFilter,
  createSaller,
  getOneSallerByFilter,
  getDetailsSaller,
  getProfile,
  updateSallerByFilter,
  deleteSaller,
};
