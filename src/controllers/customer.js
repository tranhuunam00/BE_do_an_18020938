const pdf = require("../helpers/pdf/pdf");
const logger = require("../utils/logger");
const httpResponses = require("../utils/httpResponses");

//
const templateHelper = require("../helpers/template");
const mailerHelper = require("../helpers/mailer");
const constants = require("../constants/constants");
const enums = require("../constants/enum");
const helpers = require("../helpers/help");
//
const authService = require("../services/auth");
const userService = require("../services/user");
const securityService = require("../services/security");
const customerService = require("../services/customer");
const walletService = require("../services/wallet");
const paymentMomoService = require("../services/momo");
const cartService = require("../services/cart");
const sallerService = require("../services/sallers");
const productService = require("../services/product");
const wallet = require("../models/wallet");
const paymentService = require("../services/payment");
const orderService = require("../services/order");
const payment = require("../models/payment");
//

const signUp = async (req, res) => {
  try {
    const { email, password, role, name } = req.body;

    if (!email || !password || !role || !name) {
      logger.debug(`[signUpCustomer] ->${httpResponses.INFOR_INVALID}`);
      return res.badRequest(httpResponses.INFOR_INVALID);
    }

    const existUser = await userService.getOneUserByFilter({
      email,
    });

    if (existUser) {
      logger.debug(`[signUpCustomer] ->${httpResponses.EMAIL_ALREADY_EXISTS}`);
      return res.badRequest(httpResponses.EMAIL_ALREADY_EXISTS);
    }

    const hashPassword = securityService.hashPassword(password);

    const newUser = { email: email.toLowerCase(), password: hashPassword };
    const user = await userService.createUser(newUser);
    const newCustomer = {
      user: user._id,
      name,
    };

    const customer = await customerService.createCustomer(newCustomer);
    const wallet = await walletService.createWallet({
      customer: customer._id,
      point: 0,
    });

    logger.debug(
      `[signUpCustomer] ->${httpResponses.USER_CREATE_SUCCESSFULLY}`
    );

    return res.created(httpResponses.USER_CREATE_SUCCESSFULLY);
  } catch (err) {
    logger.error(`[sign-up] ->${err.message}`);
    return res.internalServer(err.message);
  }
};

const incrementMoneyByMomo = async (req, res) => {
  try {
    const { customer } = req.session;

    let { money } = req.query;
    money = +money || 0;
    logger.info(`[incrementMoneyByMomo] money -> ${money}`);

    if (!money || money < 1000 || money > 20000000) {
      logger.debug(`[incrementMoneyByMomo] money -> Monny invalid`);
      return res.badRequest(`Monny invalid`);
    }

    const wallet = await walletService.getOneWalletByFilter({
      customer: "6226ce39aa38b1cbfd48da70",
    });

    logger.debug(`[incrementMoneyByMomo] wallet_id -> ${wallet._id}`);

    const token = authService.generateToken({
      walletId: wallet._id,
      money: money,
    });

    const redirect = `${constants.REDIRECT_URL_MOMO}/${token}`;

    await paymentMomoService.createPaymentMomo({
      wallet: wallet._id,
      currentPayment: money,
      token: token,
      type: enums.TypePayment.MOMO,
    });
    const body = await paymentMomoService.paymentMomo(money, redirect);

    if (!body.payUrl) {
      logger.debug(`[incrementMoneyByMomo] error : payurl : null`);
      return res.status(404).json(body);
    }

    return res.redirect(body.payUrl);
  } catch (err) {
    logger.error(`[incrementMoneyByMomo] -> ${err.message}`);
    return res.internalServer(err.message);
  }
};

const paymentWithMomoReturn = async (req, res) => {
  try {
    const { token } = req.params;

    const tokenGenerator = authService.verifyToken(token) || "";

    if (!tokenGenerator.success) {
      logger.debug(`[paymentWithMomoReturn] ${tokenGenerator.payload}`);
      return res.status(httpResponses.HTTP_STATUS_UNAUTHORIZED).json({
        success: false,
        message: tokenGenerator.payload,
      });
    }
    console.log(tokenGenerator);
    const processPayments = [];
    const processOrders = [];
    const processProducts = [];

    tokenGenerator.payload.payments.forEach((pay) => {
      processPayments.push(
        paymentService.getOnePaymentByFilter({
          _id: pay,
          customer: tokenGenerator.payload.customer,
          orderId: tokenGenerator.payload.orderId,
          status: { $eq: enums.StatusPayment.AWAIT_MOMO },
        })
      );
      processOrders.push(paymentService.getOrderByPaymentId(pay));
      processProducts.push(paymentService.getProductByPaymentId(pay));
    });

    const payments = await Promise.all(processPayments);
    const orders = await Promise.all(processOrders);
    const products = await Promise.all(processProducts);
    console.log("qua");

    let checkFound = false;
    payments.forEach((p, i) => {
      if (!payments[i] || !orders[i] || !products[i]) {
        checkFound = true;
      }
    });
    console.log("qua");
    if (checkFound) {
      logger.debug([
        `[[paymentWithMomoReturn] ${httpResponses.PAYMENT_NOT_FOUND}`,
      ]);
      return res.notFound(httpResponses.PAYMENT_NOT_FOUND);
    }

    let updatePayments = [];
    const updateProducts = [];
    const deleteCart = [];

    payments.forEach((pay, index) => {
      updatePayments.push(
        paymentService.updatePaymentByFilter(
          { _id: pay._id },
          { status: enums.StatusPayment.SUCCESS }
        )
      );

      const newAmount = products[index].amount - orders[index].amount;
      updateProducts.push(
        productService.updateProduct(
          { _id: products[index]._id },
          { amount: newAmount }
        )
      );
      deleteCart.push(
        cartService.deleteCartsByFilter({
          _id: tokenGenerator.payload.carts[index],
        })
      );
    });
    await Promise.all(updateProducts);
    await Promise.all(deleteCart);
    await Promise.all(updatePayments);
    logger.debug(`[paymentWithMomo] ${httpResponses.SUCCESS}`);

    res.status(200).redirect(`${process.env.FE_ENDPOINT}`);
  } catch (err) {
    logger.error(`[paymentWithMomo] error -> ${err.message}`);
    res.status(500).json({ message: err.message });
  }
};

/**
 * get all
 */
const getAllCustomer = async (req, res) => {
  try {
    res.json("oki");
  } catch (err) {
    logger.error(`[getAllCustomer] error -> ${err.message}`);
    res.internalServer(err.message);
  }
};

/**
 * get all
 */

const getDetailsCustomer = async (req, res) => {
  try {
    const { _id } = req.params;
    logger.info(`[getDetailsCustomer]  Id  -> ${_id}`);
    const customer = await customerService.getDetailsCustomer(_id);
    logger.debug(`[getDetailsCustomer] ${httpResponses.SUCCESS}`);
    res.ok(httpResponses.SUCCESS, customer);
  } catch (e) {
    logger.error(`[getDetailsCustomer]`);
    return res.internalServer(e.message);
  }
};

/**
 * get all
 */

const getProfile = async (req, res) => {
  try {
    const { user } = req.session;
    logger.info(`[getProfile]  Id  -> ${user._id}`);
    const customer = await customerService.getProfile(user._id);
    logger.debug(`[getProfile] ${httpResponses.SUCCESS}`);
    res.ok(httpResponses.SUCCESS, customer);
  } catch (e) {
    logger.error(`[getProfile]`);
    return res.internalServer(e.message);
  }
};

const createCartCustomer = async (req, res) => {
  try {
    const { customer } = req.session;
    const newModel = req.body;
    newModel.customer = customer._id;

    if (
      !newModel.product ||
      !newModel.amount ||
      +newModel.amount < 0 ||
      !Number.isInteger(+newModel.amount)
    ) {
      logger.debug(`[createCartCustomer] ${httpResponses.QUERY_INVALID}`);
      return res.badRequest(httpResponses.QUERY_INVALID);
    }
    newModel.amount = +newModel.amount;
    const productExist = await productService.getProduct({
      _id: newModel.product,
      amount: { $gte: newModel.amount },
    });
    if (!productExist) {
      logger.debug(`[createCartCustomer] ${httpResponses.PRODUCT_NOT_FOUND}`);
      return res.notFound(httpResponses.PRODUCT_NOT_FOUND);
    }
    const cartEx = await cartService.getCartByFilter({
      product: newModel.product,
      customer: newModel.customer,
    });

    if (cartEx) {
      logger.debug(`[createCartCustomer] ${httpResponses.CART_EXISTED}`);
      return res.notFound(httpResponses.CART_EXISTED);
    }

    const newCart = await cartService.createCart(newModel);

    if (!newCart) {
      logger.debug(`[createCartCustomer] ${httpResponses.FAIL}`);
      return res.badRequest(httpResponses.FAIL);
    }

    logger.debug(`[createCartCustomer] ${httpResponses.SUCCESS}`);
    res.created(httpResponses.SUCCESS, newCart);
  } catch (e) {
    logger.error(`[createCartCustomer]`);
    return res.internalServer(e.message);
  }
};

const updateCartCustomer = async (req, res) => {
  try {
    const { customer } = req.session;
    const newModel = req.body;
    newModel.customer = customer._id;

    if (
      !newModel.product ||
      !newModel.amount ||
      +newModel.amount < 0 ||
      !Number.isInteger(+newModel.amount)
    ) {
      logger.debug(`[updateCartCustomer] ${httpResponses.QUERY_INVALID}`);
      return res.badRequest(httpResponses.QUERY_INVALID);
    }
    newModel.amount = +newModel.amount;

    const product = await productService.getProduct({
      _id: newModel.product,
      amount: { $gte: +newModel.amount },
    });

    if (!product) {
      logger.debug(`[updateCartCustomer] ${httpResponses.PRODUCT_NOT_FOUND}`);
      return res.notFound(httpResponses.PRODUCT_NOT_FOUND);
    }

    const cart = await cartService.updateCartByFilter(
      {
        _id: newModel._idCart,
        product: newModel.product,
      },
      { amount: newModel.amount }
    );

    if (!cart) {
      logger.debug(`[updateCartCustomer] ${httpResponses.CART_NOT_FOUND}`);
      return res.notFound(httpResponses.CART_NOT_FOUND);
    }

    logger.debug(`[updateCartCustomer] ${httpResponses.SUCCESS}`);
    res.ok(httpResponses.SUCCESS);
  } catch (e) {
    logger.error(`[updateCartCustomer]`);
    return res.internalServer(e.message);
  }
};

const deleteCartCustomer = async (req, res) => {
  try {
    const { customer } = req.session;
    const { _idCart } = req.body;
    console.log(_idCart);
    const cart = await cartService.deleteCartsByFilter({
      _id: _idCart,
      customer: customer._id,
    });

    if (!cart) {
      logger.debug(`[deleteCartCustomer] ${httpResponses.CART_NOT_FOUND}`);
      return res.notFound(httpResponses.CART_NOT_FOUND);
    }

    logger.debug(`[deleteCartCustomer] ${httpResponses.SUCCESS}`);
    res.ok(httpResponses.SUCCESS);
  } catch (e) {
    logger.error(`[deleteCartCustomer]`);
    return res.internalServer(e.message);
  }
};

const getCartsCustomer = async (req, res) => {
  try {
    const { customer } = req.session;
    logger.info(`[getCartsCustomer] customerId ${customer._id}`);

    const carts = await cartService.getAllCartsByFilter({
      customer: customer._id,
    });

    if (!carts) {
      logger.debug(`[getCartsCustomer] ${httpResponses.CART_NOT_FOUND}`);
      return res.notFound(httpResponses.CART_NOT_FOUND);
    }

    logger.debug(`[getCartsCustomer] ${httpResponses.SUCCESS}`);
    res.ok(httpResponses.SUCCESS, carts);
  } catch (e) {
    logger.error(`[getCartsCustomer]`);
    return res.internalServer(e.message);
  }
};

const createOrder = async (req, res) => {
  try {
    let urlMomo;
    const orderId = process.env.PARTNER_CODE + new Date().getTime();
    const { customer } = req.session;
    const {
      buyProducts,
      nameReceiver,
      addressReceiver,
      phoneReceiver,
      notifyReceiver,
      paymentMethod,
    } = req.body;

    if (
      !buyProducts ||
      !nameReceiver ||
      !addressReceiver ||
      !paymentMethod ||
      !phoneReceiver ||
      !Array.isArray(buyProducts) ||
      !helpers.isVietnamesePhoneNumber(phoneReceiver) ||
      !Object.keys(enums.TypePayment).includes(paymentMethod)
    ) {
      logger.debug(`[createOrder] ${httpResponses.QUERY_INVALID}`);
      return res.badRequest(httpResponses.QUERY_INVALID);
    }
    console.log(buyProducts);
    //check product existed
    const processProductExist = buyProducts.map((product) =>
      productService.getProduct({
        _id: product._id,
        amount: { $gte: product.amount },
      })
    );

    const productsExist = await Promise.all(processProductExist);
    let checkExist = false;
    let total = 0;

    let newModelOrders = [];
    productsExist.forEach((p, index) => {
      if (!p) {
        checkExist = true;
      } else {
        total += p.price * buyProducts[index].amount;
        const totalPriceOrder = p.price * buyProducts[index].amount;
        newModelOrders.push({
          status: enums.StatusOrder.PREPARE,
          addressReceiver,
          phoneReceiver,
          notifyReceiver,
          nameReceiver,
          customer: customer._id,
          product: p._id,
          totalPrice: totalPriceOrder,
          amount: buyProducts[index].amount,
        });
      }
    });

    if (checkExist) {
      logger.debug(`[createOrder] ${httpResponses.PRODUCT_NOT_FOUND}`);
      return res.notFound(httpResponses.PRODUCT_NOT_FOUND);
    }

    //create order--------------------------------------------------------------------------------------------

    const orders = await orderService.createManyOrder(newModelOrders);
    logger.debug(`[createOrder] order súccess`);

    //create payment
    const newModelPayments = [];
    orders.forEach((order) => {
      if (paymentMethod === enums.TypePayment.MOMO) {
        newModelPayments.push({
          customer: customer._id,
          order: order._id,
          status: enums.StatusPayment.AWAIT_MOMO,
          transactionId: orderId,
          point: order.totalPrice,
          paymentMethod: paymentMethod,
        });
      }
      if (paymentMethod === enums.TypePayment.DIRECT) {
        const transactionId = new Date().getTime().toString();
        +helpers.randomNumber(10000).toString();

        newModelPayments.push({
          customer: customer._id,
          order: order._id,
          status: enums.StatusPayment.UNPAID,
          transactionId: transactionId,
          point: order.totalPrice,
          paymentMethod: paymentMethod,
        });
      }
    });

    const payments = await paymentService.createManyPayments(newModelPayments);
    logger.debug(`[createOrder] payment súccess`);

    //Thanh toán momo----------------------------------------------------------------------------------------------
    if (paymentMethod == enums.TypePayment.MOMO) {
      const data = {
        customer: customer._id,
        orderId: orderId,
        payments: payments.map((p) => p._id),
        carts: buyProducts.map((b) => b._idCard),
      };

      const token = authService.generateToken({ ...data });

      const redirect = `${constants.REDIRECT_URL_MOMO}/${token}`;

      const body = await paymentMomoService.paymentMomo(
        total,
        redirect,
        orderId
      );
      //thanh toan loi
      if (!body.payUrl) {
        logger.debug(`[incrementMoneyByMomo] error : payurl : null`);
        const deleteOrdersProcess = [];
        const deletePaymentsProcess = [];
        orders.forEach((o, index) => {
          deleteOrdersProcess.push(
            orderService.deleteOrdersByFilter({ _id: o._id })
          );
          deletePaymentsProcess.push(
            paymentService.deletePaymentsByFilter({ _id: payments[index]._id })
          );
        });
        await Promise.all(deleteOrdersProcess);
        await Promise.all(deletePaymentsProcess);
        logger.debug(
          `[createOrder] delete orders and payment when not create momo  ${httpResponses.SUCCESS}`
        );

        return res.badRequest(httpResponses.CREATE_MOMO_ERROR);
      }

      logger.debug(`[createOrder] create momo  ${httpResponses.SUCCESS}`);
      console.log(body.payUrl);
      urlMomo = body?.payUrl;
    }

    if (paymentMethod === enums.TypePayment.DIRECT) {
      //update product
      const updateProduct = [];
      productsExist.forEach((p, index) => {
        const newAmount = p.amount - +buyProducts[index].amount;
        updateProduct.push(
          productService.updateProduct({ _id: p._id }, { amount: newAmount })
        );
      });
      await Promise.all(updateProduct);
      logger.debug(`[createOrder] update product ${httpResponses.SUCCESS}`);

      //
      //delete cart
      const deleteCartsProcess = [];
      buyProducts.forEach((p) => {
        deleteCartsProcess.push(
          cartService.deleteCartsByFilter({ _id: p._idCard })
        );
      });
      await Promise.all(deleteCartsProcess);
      logger.debug(`[createOrder] delete cart  ${httpResponses.SUCCESS}`);
    }

    //

    logger.debug(`[createOrder] ${httpResponses.SUCCESS}`);
    return res.created(httpResponses.SUCCESS, urlMomo);
  } catch (e) {
    logger.error(`[createOrder] ${e.message}`);
    return res.internalServer(e.message);
  }
};
module.exports = {
  signUp,
  incrementMoneyByMomo,
  getAllCustomer,
  paymentWithMomoReturn,
  getDetailsCustomer,
  getProfile,
  createCartCustomer,
  deleteCartCustomer,
  getCartsCustomer,
  updateCartCustomer,
  createOrder,
};
