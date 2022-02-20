const mongoose = require("mongoose");

// constants
const { UserRole } = require("../constants/enum");

const userSchema = mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    push: [
      {
        token: String,
        deviceId: String,
        os: String,
      },
    ],
    role: {
      type: String,
      enum: UserRole,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("users", userSchema);
