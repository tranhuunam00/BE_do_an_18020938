const mongoose = require("mongoose");
const enums = require("../constants/enum");
const constants = require("../constants/constants");
// constants

const sallerSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    dob: String,
    gender: {
      type: String,
      enum: enums.Gender,
      required: true,
    },
    description: String,
    avatarUrl: {
      type: String,
      default: constants.AVATAR_DEFAULT,
    },
    coverUrl: {
      type: String,
      default: constants.COVER_DEFAULT,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("sallers", sallerSchema);
