const Order = require('../models/order');
const { lookup, unwind } = require('../utils/utility');
const mongoose = require('mongoose');

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

const getAllOrdersBySaller = async (filter) => {
  const pipeline = [
    filter.customerId ? { $match: { customer: filter.customerId } } : { $match: {} },
    lookup('products', 'product', '_id', 'product'),
    unwind('$product'),
    lookup('payments', '_id', 'order', 'payment'),
    unwind('$payment'),
    filter.sallerId
      ? {
          $match: {
            $expr: {
              $and: [{ $eq: ['$product.saller', filter.sallerId] }],
            },
          },
        }
      : { $match: {} },
    {
      $project: {
        _id: 1,
        amount: 1,
        status: 1,
        totalPrice: 1,
        addressReceiver: 1,
        phoneReceiver: 1,
        nameReceiver: 1,
        notifyReceiver: 1,
        product: { imgUrl: 1, name: 1, price: 1, amount: 1 },
        payment: {
          paymentMethod: 1,
          status: 1,
          transactionId: 1,
        },
      },
    },
  ];

  const docs = await Order.aggregate(pipeline);

  if (filter.statusOrder && filter.statusOrder !== 'ALL') {
    pipeline.push({
      $match: { $expr: { $eq: ['$status', filter.statusOrder] } },
    });
  }
  if (filter.statusPayment && filter.statusPayment !== 'ALL') {
    pipeline.push({
      $match: { $expr: { $eq: ['$payment.status', filter.statusPayment] } },
    });
  }
  const doc = await Order.aggregate(pipeline);

  pipeline.push({ $skip: (+filter._page - 1) * +filter._limit });
  pipeline.push({ $limit: +filter._limit });
  const orders = await Order.aggregate(pipeline);
  return { orders, count: doc.length, total: docs.length };
};

const getDetailOrder = async (orderId) => {
  const docs = await Order.aggregate([{ $match: { _id: mongoose.Types.ObjectId(orderId) } }]);
};
module.exports = {
  getAllOrdersByFilter,
  createOrder,
  getOneOrderByFilter,
  getOrderByFilter,
  deleteOrdersByFilter,
  updateOrderByFilter,
  createManyOrder,
  getAllOrdersBySaller,
  getDetailOrder,
};
