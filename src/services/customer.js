const Customer = require("../models/customer");
const { lookup, unwind } = require("../utils/utility");
const mongoose = require("mongoose");

const getAllCustomersByFilter = async (filter) => {
  return await Customer.find(filter);
};

const createCustomer = async (customer) => {
  const newCustomer = new Customer(customer);
  return await newCustomer.save();
};

const getOneCustomerByFilter = async (filter) => {
  return await Customer.findOne(filter);
};

const updateCustomerByFilter = async (filter, newModel) => {
  return await Customer.findOneAndUpdate(filter, newModel);
};

const getDetailsCustomer = async (customerId) => {
  const docs = await Customer.aggregate([
    {
      $match: { _id: mongoose.Types.ObjectId(customerId) },
    },
    lookup("users", "user", "_id", "user"),
    unwind("$user", true),
  ]);
  const res = docs && docs.length > 0 ? docs[0] : null;
  console.log(res);
  return res;
};

const getProfile = async (userId) => {
  const docs = await Customer.aggregate([
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

const deleteCustomer = async (filter) => {
  return await Customer.deleteOne(filter);
};

module.exports = {
  getAllCustomersByFilter,
  createCustomer,
  getOneCustomerByFilter,
  getDetailsCustomer,
  getProfile,
  updateCustomerByFilter,

  deleteCustomer,
};
