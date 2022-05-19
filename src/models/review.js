const mongoose = require('mongoose');
const enums = require('../constants/enum');
const constants = require('../constants/constants');
// constants

const reviewSchema = mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'products',
      required: true,
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'customers',
      required: true,
    },
    star: {
      type: Number,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    imgUrls: [{ type: String }],
  },
  { timestamps: true }
);

module.exports = mongoose.model('reviews', reviewSchema);
