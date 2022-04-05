const mongoose = require("mongoose");
const enums = require("../constants/enum");
const constants = require("../constants/constants");
// constants

const productSchema = mongoose.Schema(
  {
    saller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "sallers",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    imgUrl: [
      {
        type: String,
      },
    ],
    type: {
      type: String,
      enums: enums.TypeProduct,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("products", productSchema);
