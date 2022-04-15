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

    if (req.files && req.files.imgProduct && req.files.imgProduct[0]) {
      const imgUrl = await googleDriveService.uploadMultiGgDrive(
        req.files.imgProduct
      );
      newModel.imgUrl = imgUrl;
    }

    console.log(newModel);

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
    const {
      _page,
      _limit,
      _textSearch,
      _typeProduct,
      _minMoney,
      _maxMoney,
      _sortMoney,
      _sortTime,
    } = req.query;

    const existSaller = await sallerService.getOneSallerByFilter({
      _id: sallerId,
    });
    console.log(_sortTime);
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
    filter._minMoney = +_minMoney;
    filter._maxMoney = +_maxMoney;
    filter._sortTime = _sortTime;
    filter._sortMoney = +_sortMoney;
    if (filter._minMoney === 0) {
      filter._minMoney = 0.1;
    }
    console.log(filter);
    if (_typeProduct == "ALL") {
      const productArray = [];

      Object.keys(enums.TypeProduct).forEach((key) => {
        const filterNew = constants.FILTER_DEFAULT_ALL_PRODUCT;
        filterNew.sallerId = sallerId;
        filterNew.typeProduct = enums.TypeProduct[key];
        productArray.push(productService.getALlProduct(filterNew));
      });

      const result = await Promise.all(productArray);
      const products = {};
      Object.keys(enums.TypeProduct).forEach((key, index) => {
        products[key] = {
          total: result[index].total,
          products: result[index].products,
        };
      });

      logger.debug(`[getALlProduct]  All -> ${httpResponses.SUCCESS}`);
      return res.ok(httpResponses.SUCCESS, products);
    }

    if (_typeProduct) {
      filter.typeProduct = Object.values(enums.TypeProduct).some(
        (v) => v === _typeProduct
      )
        ? _typeProduct
        : null;
    }

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
