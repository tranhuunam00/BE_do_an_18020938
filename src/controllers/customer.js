const pdf = require("../helpers/pdf/pdf");
const logger = require("../utils/logger");
const httpResponses = require("../utils/httpResponses");

//
const templateHelper = require("../helpers/template");
const mailerHelper = require("../helpers/mailer");
const constants = require("../constants/constants");
const enums = require("../constants/enum");
//
const authService = require("../services/auth");
const userService = require("../services/user");
const securityService = require("../services/security");
const customerService = require("../services/customer");
const walletService = require("../services/wallet");
const paymentMomoService = require("../services/momo");
const wallet = require("../models/wallet");
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
    const [paymentMomo, walletMomo] = await Promise.all([
      paymentMomoService.getOnePaymentMomoByFilter({
        token: token,
      }),
      walletService.getOneWalletByFilter({
        _id: tokenGenerator.payload.walletId,
      }),
    ]);

    if (!paymentMomo || !walletMomo) {
      logger.debug([`[[paymentWithMomoReturn] paymentMomo -> notFound`]);
      return res.notFound(`paymentMomo or walletMomo -> notFound`);
    }
    if (tokenGenerator.payload.walletId != paymentMomo.wallet) {
      logger.debug([
        `[[paymentWithMomoReturn] walletIdGeneraByToken -> notFound`,
      ]);
      return res.notFound(`walletIdGeneraByToken -> notFound`);
    }
    await Promise.all([
      walletService.updateOneWalletByFilter(
        { _id: walletMomo._id },
        {
          point: walletMomo.point + tokenGenerator.payload.money,
        }
      ),
      paymentMomoService.updateOneWalletByFilter(
        { token: token },
        {
          token: "",
        }
      ),
    ]);

    return res.json("ok");
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
module.exports = {
  signUp,
  incrementMoneyByMomo,
  getAllCustomer,
  paymentWithMomoReturn,
  getDetailsCustomer,
  getProfile,
};
