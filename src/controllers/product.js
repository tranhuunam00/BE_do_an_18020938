const logger = require('../utils/logger');
const httpResponses = require('../utils/httpResponses');
const constants = require('../constants/constants');
const enums = require('../constants/enum');

const productService = require('../services/product');
const googleDriveService = require('../services/googleDriveService');
const sallerService = require('../services/sallers');
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
      newModel.name?.length < 5 ||
      newModel.description?.length < 10 ||
      +newModel.price < -1 ||
      +newModel.amount < -1 ||
      newModel.saller ||
      newModel._id ||
      !Number.isInteger(+newModel.amount) ||
      !Object.keys(enums.TypeProduct).some((t) => t === newModel.type)
    ) {
      logger.debug(`[createProduct] -> ${httpResponses.QUERY_INVALID}`);
      return res.notFound(httpResponses.QUERY_INVALID);
    }

    newModel.price = +newModel.price > 0 ? newModel.price : constants.PRODUCT_PRICE_DEFAULT;

    newModel.amount = +newModel.amount > 0 ? newModel.amount : constants.PRODUCT_AMOUNT_DEFAULT;
    newModel.saller = saller._id;

    if (req.files && req.files.imgProduct && req.files.imgProduct[0]) {
      const imgUrl = await googleDriveService.uploadMultiGgDrive(req.files.imgProduct);
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
    const { _page, _limit, _textSearch, _typeProduct, _minMoney, _maxMoney, _sortMoney, _sortTime } = req.query;

    if (sallerId) {
      const existSaller = await sallerService.getOneSallerByFilter({
        _id: sallerId,
      });

      if (!existSaller) {
        logger.debug(`[getALlProduct] -> ${httpResponses.SALLER_NOT_FOUND}`);
        return res.notFound(httpResponses.SALLER_NOT_FOUND);
      }
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

    if (_typeProduct == 'ALL') {
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
      filter.typeProduct = Object.values(enums.TypeProduct).some((v) => v === _typeProduct) ? _typeProduct : null;
    }

    const { products, count, total } = await productService.getALlProduct(filter);

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
    const { productId } = req.params;
    logger.info(`[getDetailProduct] productId: ${productId}`);

    const product = await productService.getDetailProduct(productId);

    if (!product) {
      logger.debug(`[getDetailProduct] -> ${httpResponses.PRODUCT_NOT_FOUND}`);
      return res.notFound(httpResponses.PRODUCT_NOT_FOUND);
    }

    if (req.files && req.files.imgProduct && req.files.imgProduct[0]) {
      const imgUrl = await googleDriveService.uploadMultiGgDrive(req.files.imgProduct);
      newModel.imgUrl = imgUrl;
    }

    logger.debug(`[getDetailProduct] -> ${httpResponses.SUCCESS}`);
    console.log('123');
    res.ok(httpResponses.SUCCESS, product);
  } catch (err) {
    logger.error(`[getDetailProduct] error -> ${err.message}`);
    res.internalServer(err.message);
  }
};

/********************************
 * update Product
 *
 */
const updateProduct = async (req, res) => {
  try {
    const newModel = req.body;
    const { productId } = req.params;
    const { saller } = req.session;

    logger.debug(`[updateProduct] productId =->${productId}`);
    logger.debug(`[updateProduct] sallerId =->${saller._id}`);

    if (newModel.imgUrl) {
      newModel.imgUrl = newModel.imgUrl.split(',');
    }
    console.log(newModel);
    if (
      newModel.name?.length < 5 ||
      newModel.description?.length < 10 ||
      (newModel.price && +newModel.price < 0) ||
      (newModel.amount && +newModel.amount < 0) ||
      (newModel.amount && !Number.isInteger(+newModel.amount)) ||
      (newModel.type && !Object.keys(enums.TypeProduct).includes(newModel.type)) ||
      (newModel.imgUrl && !Array.isArray(newModel.imgUrl))
    ) {
      logger.debug(`[updateProduct] -> ${httpResponses.QUERY_INVALID}`);
      return res.badRequest(httpResponses.QUERY_INVALID);
    }
    if (newModel._id) {
      delete newModel._id;
    }
    if (newModel.saller) {
      delete newModel.saller;
    }
    if (newModel.price) {
      newModel.price = +newModel.price;
    }
    if (newModel.amount) {
      newModel.amount = +newModel.amount;
    }
    const currentProduct = await productService.getProduct({
      saller: saller._id,
      _id: productId,
    });

    if (!currentProduct) {
      logger.debug(`[updateProduct] -> ${httpResponses.PRODUCT_NOT_FOUND}`);
      return res.notFound(httpResponses.PRODUCT_NOT_FOUND);
    }

    if (req.files && req.files.imgProduct && req.files.imgProduct[0]) {
      const imgUrlDriver = await googleDriveService.uploadMultiGgDrive(req.files.imgProduct);
      let checkExistUrlImg = false;

      newModel.imgUrl.forEach((url, index) => {
        if (url !== 'false') {
          if (!currentProduct.imgUrl.includes(url)) {
            checkExistUrlImg = true;
          }
        }
        if (url === 'false' && imgUrlDriver?.length > 0) {
          newModel.imgUrl[index] = imgUrlDriver[0];
          url = imgUrlDriver[0];
          imgUrlDriver.shift();
        }
        if (url === 'false' && imgUrlDriver?.length === 0) {
          newModel.imgUrl.splice(index, 1);
        }
      });

      newModel.imgUrl = newModel.imgUrl.concat(imgUrlDriver);

      console.log(newModel.imgUr);

      if (checkExistUrlImg) {
        logger.debug(`[updateProduct] -> ${httpResponses.PRODUCT_IMG_URL_NOT_FOUND}`);
        return res.notFound(httpResponses.PRODUCT_IMG_URL_NOT_FOUND);
      }
      if (newModel.imgUrl.length > 6) {
        logger.debug(`[updateProduct] -> ${httpResponses.PRODUCT_IMG_URL_LIMIT_6}`);
        return res.notFound(httpResponses.PRODUCT_IMG_URL_LIMIT_6);
      }
    }
    if (newModel.imgUrl === '') {
      newModel.imgUrl = [];
    }
    console.log(newModel);
    const updateP = await productService.updateProduct(
      {
        saller: saller._id,
        _id: productId,
      },
      newModel
    );

    logger.debug(`[updateProduct] -> ${httpResponses.SUCCESS}`);
    res.created(httpResponses.SUCCESS);
  } catch (err) {
    logger.error(`[updateProduct] error -> ${err.message}`);
    res.internalServer(err.message);
  }
};

// /********************************
//  * get Detail Product
//  *
//  */
//  const getDetailProduct = async (req, res) => {
//   try {
//     logger.debug(`[getALlProduct] -> ${httpResponses.SUCCESS}`);
//     res.created(httpResponses.SUCCESS);
//   } catch (err) {
//     logger.error(`[getAllCustomer] error -> ${err.message}`);
//     res.internalServer(err.message);
//   }
// };

module.exports = {
  createProduct,
  getALlProduct,
  getDetailProduct,
  updateProduct,
};
