const Product = require("../models/product");
const { lookup, unwind } = require("../utils/utility");
const mongoose = require("mongoose");

const createProduct = async (product) => {
  const newProduct = new Product(product);
  return await newProduct.save();
};

const getALlProduct = async (filter) => {
  const pipeline = [{ $match: {} }];
  if (filter.sallerId) {
    pipeline.push({
      $match: { saller: mongoose.Types.ObjectId(filter.sallerId) },
    });
  }
  const docs = await Product.aggregate(pipeline);
  if (filter._textSearch) {
    pipeline.push({
      $match: {
        name: { $regex: filter._textSearch, $options: "i" },
      },
    });
  }
  const doc = await Product.aggregate(pipeline);

  const { _page, _limit } = filter.pagination;

  pipeline.push({ $skip: (_page - 1) * _limit });
  pipeline.push({ $limit: _limit });
  const products = await Product.aggregate(pipeline);

  return { products, count: doc.length, total: docs.length };
};
module.exports = { createProduct, getALlProduct };
