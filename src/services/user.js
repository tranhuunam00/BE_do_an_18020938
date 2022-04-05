const User = require("../models/user");

const getAllUsersByFilter = async (filter) => {
  return await User.find(filter);
};

const createUser = async (user) => {
  const newUser = new User(user);
  return await newUser.save();
};

const getOneUserByFilter = async (filter) => {
  return await User.findOne(filter);
};

const getUserByFilter = async (filter) => {
  return await User.findOne(filter);
};

const deleteUsersByFilter = async (filter) => {
  return await User.deleteMany(filter);
};

const updateUserByFilter = async (filter, userUpdate) => {
  return await User.findOneAndUpdate(filter, userUpdate);
};
module.exports = {
  getAllUsersByFilter,
  createUser,
  getOneUserByFilter,
  getUserByFilter,
  deleteUsersByFilter,
  updateUserByFilter,
};
