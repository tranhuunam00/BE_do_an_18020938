const Review = require('../models/review');

const getAllReviewsByFilter = async (filter) => {
  return await Review.find(filter);
};

const createReview = async (review) => {
  const newReview = new Review(review);
  return await newReview.save();
};

const getOneReviewByFilter = async (filter) => {
  return await Review.findOne(filter);
};

const getReviewByFilter = async (filter) => {
  return await Review.findOne(filter);
};

const deleteReviewsByFilter = async (filter) => {
  return await Review.deleteMany(filter);
};

const updateReviewByFilter = async (filter, reviewUpdate) => {
  return await Review.findOneAndUpdate(filter, reviewUpdate);
};
module.exports = {
  getAllReviewsByFilter,
  createReview,
  getOneReviewByFilter,
  getReviewByFilter,
  deleteReviewsByFilter,
  updateReviewByFilter,
};
