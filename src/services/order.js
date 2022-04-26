const Order = require("../models/order");

const getAllOrdersByFilter = async (filter) => {
  return await Order.find(filter);
};

const createOrder = async (order) => {
  const newOrder = new Order(order);
  return await newOrder.save();
};

const createManyOrder = async (orders) => {
  return await Order.insertMany(orders);
};
const getOneOrderByFilter = async (filter) => {
  return await Order.findOne(filter);
};

const getOrderByFilter = async (filter) => {
  return await Order.findOne(filter);
};

const deleteOrdersByFilter = async (filter) => {
  return await Order.deleteMany(filter);
};

const updateOrderByFilter = async (filter, orderUpdate) => {
  return await Order.findOneAndUpdate(filter, orderUpdate);
};
module.exports = {
  getAllOrdersByFilter,
  createOrder,
  getOneOrderByFilter,
  getOrderByFilter,
  deleteOrdersByFilter,
  updateOrderByFilter,
  createManyOrder,
};
