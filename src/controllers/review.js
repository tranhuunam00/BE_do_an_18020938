const logger = require('../utils/logger');
const httpResponses = require('../utils/httpResponses');
const constants = require('../constants/constants');
const enums = require('../constants/enum');

const productService = require('../services/product');
const googleDriveService = require('../services/googleDriveService');
const sallerService = require('../services/sallers');
const reviewService = require('../services/review');
const orderService = require('../services/order');

/********************************
 * create Review
 *
 */
const createReview = async (req, res) => {
  try {
    const { customer } = req.session;
    logger.debug(`[createReview] customerId => ${customer._id}`);
    const newModel = req.body;
    console.log(newModel);
    if (!newModel.product || !newModel.star || !newModel.content || ![1, 2, 3, 4, 5].includes(+newModel.star)) {
      logger.debug(`[createReview] -> ${httpResponses.QUERY_INVALID}`);
      return res.badRequest(httpResponses.QUERY_INVALID);
    }
    newModel.star = +newModel.star;
    const productExist = await productService.getProduct({ _id: newModel.product });
    if (!productExist) {
      logger.debug(`[createReview] -> ${httpResponses.PRODUCT_NOT_FOUND}`);
      return res.badRequest(httpResponses.PRODUCT_NOT_FOUND);
    }

    const orderExist = await orderService.getOneOrderByFilter({
      productId: newModel.product,
      customer: customer._id,
      status: enums.StatusOrder.SUCCESS,
    });
    if (!orderExist) {
      logger.debug(`[createReview] -> ${httpResponses.ORDER_NOT_FOUND}`);
      return res.badRequest(httpResponses.ORDER_NOT_FOUND);
    }
    const reviewExist = await reviewService.getReviewByFilter({ product: newModel.product, customer: customer._id });
    if (reviewExist) {
      logger.debug(`[createReview] -> ${httpResponses.REVIEW_EXISTING}`);
      return res.badRequest(httpResponses.REVIEW_EXISTING);
    }

    if (req.files && req.files.imgUrl && req.files.imgUrl[0]) {
      const imgUrls = await googleDriveService.uploadMultiGgDrive(req.files.imgUrl);
      newModel.imgUrls = imgUrls;
    }
    console.log(newModel);
    logger.debug(`[createReview] -> ${httpResponses.SUCCESS}`);
    res.created(httpResponses.SUCCESS);
  } catch (err) {
    logger.error(`[createReview] error -> ${err.message}`);
    res.internalServer(err.message);
  }
};

module.exports = {
  createReview,
};
