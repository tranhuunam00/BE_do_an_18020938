const Customer = require("../models/customer");

const getAllCustomersByFilter = async (filter) => {
  return await Customer.find(   filter);
};

const createCustomer = async (customer) => {
  const newCustomer = new Customer(customer);
  return await newCustomer.save();
};

const getOneCustomerByFilter = async (filter) => {
  return await Customer.findOne(filter);
};

module.exports = {
  getAllCustomersByFilter,
  createCustomer,
  getOneCustomerByFilter,
};
