const mongoose = require("mongoose");
const { TypePayment } = require("../constants/enum");
const walletSchema = mongoose.Schema(
  {
    wallet: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "wallets",
    },
    currentPayment: {
      type: Number,
      default: 0,
    },
    type: {
      type: String,
      enum: TypePayment,
      required: true,
      default: "MOMO",
    },
    token: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("payments", walletSchema);
