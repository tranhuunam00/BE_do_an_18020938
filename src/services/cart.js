const Cart = require("../models/cart");
const { lookup, unwind } = require("../utils/utility");

const getAllCartsByFilter = async (filter) => {
  const pipeline = [
    { $match: {} },
    lookup("products", "product", "_id", "product"),
    unwind("$product"),
    {
      $project: {
        _id: 1,
        imgUrl: "$product.imgUrl",
        price: "$product.price",
        name: "$product.name",
        amount: 1,
        productId: "$product._id",
        totalPrice: { $multiply: ["$amount", "$product.price"] },
      },
    },
  ];
  const docs = await Cart.aggregate(pipeline);

  return docs;
};

const createCart = async (cart) => {
  const newCart = new Cart(cart);
  return await newCart.save();
};

const getOneCartByFilter = async (filter) => {
  return await Cart.findOne(filter);
};

const getCartByFilter = async (filter) => {
  return await Cart.findOne(filter);
};

const deleteCartsByFilter = async (filter) => {
  return await Cart.findByIdAndDelete(filter);
};

const updateCartByFilter = async (filter, cartUpdate) => {
  return await Cart.findOneAndUpdate(filter, cartUpdate);
};
module.exports = {
  getAllCartsByFilter,
  createCart,
  getOneCartByFilter,
  getCartByFilter,
  deleteCartsByFilter,
  updateCartByFilter,
};
