const mongoose = require("mongoose");
const enums = require("../constants/enum");
const constants = require("../constants/constants");
// constants

const orderSchema = mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "products",
      required: true,
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "customers",
      required: true,
    },
    addressReceiver: {
      type: String,
      required: true,
    },
    phoneReceiver: {
      type: String,
      required: true,
    },
    nameReceiver: {
      type: String,
      required: true,
    },
    notifyReceiver: {
      type: String,
    },
    status: {
      type: String,
      enums: enums.StatusOrder,
      required: true,
      default: enums.StatusOrder.PREPARE,
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("orders", orderSchema);
