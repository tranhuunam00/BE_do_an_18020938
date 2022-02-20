const User = require("../models/user");

const getAllUsers = async (filter) => {
  return await User.find({ filter });
};

const createUser = async (user) => {
  const newUser = new User(user);
  return await newUser.save();
};

module.exports = { getAllUsers };
