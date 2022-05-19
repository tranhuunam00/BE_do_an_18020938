const express = require('express');

const reviewRoute = express.Router();

const { requireLogin, checkPermissions, checkLogin } = require('../middleware/permission');

const enums = require('../constants/enum');
const { multer } = require('../utils/multer');

const reviewController = require('../controllers/review');

reviewRoute.post(
  '/',
  requireLogin,
  checkPermissions(enums.UserRole.CUSTOMER),
  multer.fields([
    {
      name: 'imgUrl',
    },
  ]),
  reviewController.createReview
);

module.exports = reviewRoute;
