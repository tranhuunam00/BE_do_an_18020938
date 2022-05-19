const Payment = require('../models/payment');
const mongoose = require('mongoose');
const { lookup, unwind } = require('../utils/utility');

const getAllPaymentsByFilter = async (filter) => {
  return await Payment.find(filter);
};

const createPayment = async (payment) => {
  const newPayment = new Payment(payment);
  return await newPayment.save();
};

const createManyPayments = async (payments) => {
  return await Payment.insertMany(payments);
};

const getOnePaymentByFilter = async (filter) => {
  return await Payment.findOne(filter);
};

const getPaymentByFilter = async (filter) => {
  return await Payment.findOne(filter);
};

const deletePaymentsByFilter = async (filter) => {
  return await Payment.deleteMany(filter);
};

const updatePaymentByFilter = async (filter, paymentUpdate) => {
  return await Payment.findOneAndUpdate(filter, paymentUpdate);
};

const getOrderByPaymentId = async (paymentId) => {
  const doc = await Payment.aggregate([
    { $match: { _id: mongoose.Types.ObjectId(paymentId) } },
    lookup('orders', 'order', '_id', 'order'),
    unwind('$order'),
    lookup('products', 'order.product', '_id', 'product'),
    unwind('$product'),
  ]);
  const res = doc.length > 0 ? doc[0] : null;
  return res?.order;
};
const getProductByPaymentId = async (paymentId) => {
  const doc = await Payment.aggregate([
    { $match: { _id: mongoose.Types.ObjectId(paymentId) } },
    lookup('orders', 'order', '_id', 'order'),
    unwind('$order'),
    lookup('products', 'order.product', '_id', 'product'),
    unwind('$product'),
  ]);
  const res = doc.length > 0 ? doc[0] : null;
  return res?.product;
};

module.exports = {
  getAllPaymentsByFilter,
  createPayment,
  getOnePaymentByFilter,
  createManyPayments,
  getPaymentByFilter,
  deletePaymentsByFilter,
  updatePaymentByFilter,
  getProductByPaymentId,
  getOrderByPaymentId,
};
