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

module.exports = { getAllUsersByFilter, createUser, getOneUserByFilter };
