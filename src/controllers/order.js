const logger = require('../utils/logger');
const httpResponses = require('../utils/httpResponses');
const constants = require('../constants/constants');
const enums = require('../constants/enum');
const helpers = require('../helpers/help');

const productService = require('../services/product');
const googleDriveService = require('../services/googleDriveService');
const sallerService = require('../services/sallers');
const paymentService = require('../services/payment');
const orderService = require('../services/order');
const refundService = require('../services/refund');

//  get allPayment
const getAllOrders = async (req, res) => {
  const { saller, customer } = req.session;
  const filter = req.query;
  if (!filter._limit) {
    filter._limit = constants.PAGINATION_DEFAULT_LIMIT;
  }
  if (!filter._page) {
    filter._page = constants.PAGINATION_DEFAULT_PAGE;
  }
  filter._page = +filter._page;
  filter.sallerId = saller ? saller._id : null;
  filter.customerId = customer ? customer._id : null;

  console.log(filter);
  const { orders, count, total } = await orderService.getAllOrdersBySaller(filter);
  console.log(filter);
  logger.debug(`[getAllPayment] ${httpResponses.SUCCESS}`);
  return res.ok(httpResponses.SUCCESS, {
    orders,
    pagination: {
      _page: filter._page,
      _limit: filter._limit,
      _total: count,
    },
    total: total,
  });
};

//  get allPayment
const updateOrder = async (req, res) => {
  const { saller, customer } = req.session;
  const { orderId } = req.params;
  const { statusOrder } = req.body;
  let refund;
  logger.debug(`[updateOrder] id Customer ${customer?._id}`);
  logger.debug(`[updateOrder] id Saller ${saller?._id}`);
  //customer
  if (customer) {
    if (!statusOrder || statusOrder !== enums.StatusOrder.CANCEL) {
      logger.debug(`[updateOrder] customer${httpResponses.QUERY_INVALID}`);
      return res.badRequest(httpResponses.QUERY_INVALID);
    }
  }
  //saller
  if (saller) {
    const rank = helpers.rankStatusOrder();

    if (!statusOrder || !Object.keys(enums.StatusOrder).includes(statusOrder)) {
      logger.debug(`[updateOrder] ${httpResponses.QUERY_INVALID}`);
      return res.badRequest(httpResponses.QUERY_INVALID);
    }
    const orderExist = await orderService.getOrderByFilter({ _id: orderId });

    if (!orderExist) {
      logger.debug(`[updateOrder] ${httpResponses.PRODUCT_NOT_FOUND}`);
      return res.notFound(httpResponses.PRODUCT_NOT_FOUND);
    }
    const payment = await paymentService.getOnePaymentByFilter({ orderId: orderExist._id });

    if (rank[statusOrder] <= rank[orderExist.status]) {
      logger.debug(`[updateOrder] ${httpResponses.RANK_LOW}`);
      return res.badRequest(httpResponses.RANK_LOW);
    }
    if (payment.status === enums.StatusPayment.SUCCESS) {
      const newRefund = { orderId: orderExist };
      refund = await refundService.createRefund(newRefund);
    }
  }

  const order = await orderService.updateOrderByFilter({ _id: orderId }, { status: statusOrder });
  if (!order) {
    await refundService.deleteRefundsByFilter({ _id: refund._id });
  }
  logger.debug(`[updateOrder] ${httpResponses.SUCCESS}`);
  return res.ok(httpResponses.SUCCESS);
};
module.exports = { getAllOrders, updateOrder };
