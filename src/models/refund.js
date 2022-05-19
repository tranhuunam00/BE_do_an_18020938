const mongoose = require('mongoose');
const enums = require('../constants/enum');
const constants = require('../constants/constants');
// constants

const refundSchema = mongoose.Schema(
  {
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'orders',
      required: true,
    },
    status: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('refunds', refundSchema);
