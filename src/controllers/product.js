const logger = require("../utils/logger");
const httpResponses = require("../utils/httpResponses");
const constants = require("../constants/constants");
const enums = require("../constants/enum");

const productService = require("../services/product");
const googleDriveService = require("../services/googleDriveService");
const sallerService = require("../services/sallers");
/********************************
 *
 * create Product
 *
 */
const createProduct = async (req, res) => {
  try {
    const { saller } = req.session;
    logger.debug(`[createProduct] sallerId = ${saller._id}`);
    const newModel = req.body;
    console.log(newModel);
    if (
      !newModel.name ||
      !newModel.description ||
      !newModel.price ||
      !newModel.amount ||
      !newModel.type ||
      !Object.keys(enums.TypeProduct).some((t) => t === newModel.type)
    ) {
      logger.debug(`[createProduct] -> ${httpResponses.QUERY_INVALID}`);
      return res.notFound(httpResponses.QUERY_INVALID);
    }

    newModel.price =
      +newModel.price > 0 ? newModel.price : constants.PRODUCT_PRICE_DEFAULT;

    newModel.amount =
      +newModel.amount > 0 ? newModel.amount : constants.PRODUCT_AMOUNT_DEFAULT;
    newModel.saller = saller._id;

    if (req.files && req.files.img && req.files.img[0]) {
      const imgUrl = await googleDriveService.uploadMultiGgDrive(req.files.img);
      newModel.imgUrl = imgUrl;
    }
    await productService.createProduct(newModel);

    logger.debug(`[createProduct] -> ${httpResponses.SUCCESS}`);
    res.created(httpResponses.SUCCESS);
  } catch (err) {
    logger.error(`[createProduct] error -> ${err.message}`);
    res.internalServer(err.message);
  }
};

/********************************
 * get ALl Product
 *
 */
const getALlProduct = async (req, res) => {
  try {
    const { sallerId } = req.params;
    logger.info(`[getALlProduct] sallerId-> ${sallerId}`);
    const { _page, _limit, _textSearch } = req.query;

    const existSaller = await sallerService.getOneSallerByFilter({
      _id: sallerId,
    });

    if (!existSaller) {
      logger.debug(`[getALlProduct] -> ${httpResponses.SALLER_NOT_FOUND}`);
      return res.notFound(httpResponses.SALLER_NOT_FOUND);
    }

    const filter = {};
    const pagination = {
      _page: +_page > 0 ? +_page : constants.PAGINATION_DEFAULT_PAGE,
      _limit: +_limit > 0 ? +_limit : constants.PAGINATION_DEFAULT_LIMIT,
    };
    filter.pagination = pagination;
    filter.sallerId = sallerId;
    filter._textSearch = _textSearch;

    const { products, count, total } = await productService.getALlProduct(
      filter
    );

    pagination._total = count;
    
    logger.debug(`[getALlProduct] -> ${httpResponses.SUCCESS}`);
    res.ok(httpResponses.SUCCESS, { products, pagination, total });
  } catch (err) {
    logger.error(`[getAllCustomer] error -> ${err.message}`);
    res.internalServer(err.message);
  }
};

/********************************
 * get Detail Product
 *
 */
const getDetailProduct = async (req, res) => {
  try {
    logger.debug(`[getALlProduct] -> ${httpResponses.SUCCESS}`);
    res.created(httpResponses.SUCCESS);
  } catch (err) {
    logger.error(`[getAllCustomer] error -> ${err.message}`);
    res.internalServer(err.message);
  }
};

module.exports = { createProduct, getALlProduct, getDetailProduct };
