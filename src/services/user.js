const User = require("../models/user");

const getAllUsers = async (filter) => {
  return await User.find({ filter });
};

const createUser = async (user) => {
  const newUser = new User(user);
  return await newUser.save();
};

const getOneUserByFilter = async (filter) => {
  return await User.findOne({ filter });
};

module.exports = { getAllUsers, createUser, getOneUserByFilter };
