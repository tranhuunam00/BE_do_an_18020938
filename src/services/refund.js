const Refund = require('../models/refund');

const getAllRefundsByFilter = async (filter) => {
  return await Refund.find(filter);
};

const createRefund = async (refund) => {
  const newRefund = new Refund(refund);
  return await newRefund.save();
};

const getOneRefundByFilter = async (filter) => {
  return await Refund.findOne(filter);
};

const getRefundByFilter = async (filter) => {
  return await Refund.findOne(filter);
};

const deleteRefundsByFilter = async (filter) => {
  return await Refund.deleteMany(filter);
};

const updateRefundByFilter = async (filter, refundUpdate) => {
  return await Refund.findOneAndUpdate(filter, refundUpdate);
};
module.exports = {
  getAllRefundsByFilter,
  createRefund,
  getOneRefundByFilter,
  getRefundByFilter,
  deleteRefundsByFilter,
  updateRefundByFilter,
};
