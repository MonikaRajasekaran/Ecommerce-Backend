// Example model

const mongoose = require("mongoose");
const shortid = require("shortid");

const { Schema } = mongoose;

const passwordReset = new Schema(
  {
    resetId: {
      type: String,
      default: shortid.generate,
      required: true,
    },
    resetCode: {
      type: String,
      default: shortid.generate,
      required: true,
    },
    userId: {
      type: String,
      required: true,
      unique: true,
    },
    status: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("PasswordReset", passwordReset);
