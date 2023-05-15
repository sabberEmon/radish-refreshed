const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema(
  {
    OTP: {
      type: String,
      required: true,
    },
    uuid: {
      type: String,
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
      default: Date.now() + 10 * 60 * 1000, // 10 minutes
    },
  },
  { timestamps: true, versionKey: false }
);

module.exports = mongoose.model("OTP", otpSchema);
