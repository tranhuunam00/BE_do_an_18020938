const mongoose = require("mongoose");
const { TypePayment, StatusPayment } = require("../constants/enum");
const paymentSchema = mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "customers",
    },
    order: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "orders",
    },
    paymentMethod: {
      type: String,
      enums: TypePayment,
      required: true,
    },
    point: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enums: StatusPayment,
      required: true,
    },
    transactionId: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("payments", paymentSchema);
