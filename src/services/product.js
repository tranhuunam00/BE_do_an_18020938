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
  if (filter.typeProduct) {
    pipeline.push({
      $match: { type: filter.typeProduct },
    });
  }
  pipeline.push({ $sort: { createdAt: -1 } });
  const docs = await Product.aggregate(pipeline);
  if (filter._textSearch) {
    pipeline.push({
      $match: {
        name: { $regex: filter._textSearch, $options: "i" },
      },
    });
  }
  if (filter._minMoney && filter._maxMoney) {
    pipeline.push({
      $match: {
        $expr: {
          $and: [
            { $gte: ["$price", +filter._minMoney] },
            { $lte: ["$price", +filter._maxMoney] },
          ],
        },
      },
    });
  }

  const doc = await Product.aggregate(pipeline);

  const { _page, _limit } = filter.pagination;

  if (filter._sortTime) {
    pipeline.push({
      $sort: {
        createdAt: +filter._sortTime > 0 ? 1 : -1,
      },
    });
  }
  if (filter._sortMoney) {
    pipeline.push({
      $sort: {
        price: +filter._sortMoney > 0 ? 1 : -1,
      },
    });
  }
  pipeline.push({ $skip: (_page - 1) * _limit });
  pipeline.push({ $limit: _limit });
  const products = await Product.aggregate(pipeline);

  return { products, count: doc.length, total: docs.length };
};
module.exports = { createProduct, getALlProduct };
