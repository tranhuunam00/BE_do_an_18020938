const mongoose = require("mongoose");

// constants
const { UserRole } = require("../constants/enum");

const userSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    name: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("customers", userSchema);
