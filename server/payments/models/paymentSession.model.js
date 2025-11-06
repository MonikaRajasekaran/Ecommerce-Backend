const mongoose = require("mongoose");

const { Schema } = mongoose;
const shortid = require("shortid");

const PaymentSchema = new Schema(
  {
    sessionId: {
      type: String,
      required: true,
      default: shortid.generate,
    },
    userId: {
      type: String,
      required: true,
    },
    paymentSessionId: {
      type: String,
      required: true,
    },
    sesssiontype: {
      type: String,
      required: true,
      enum: ["RAZOR", "STRIPE"],
    },
    paymentIntent: {
      type: String,
    },
    meta: {
      type: Schema.Types.Mixed,
    },
    type: {
      type: String,
      default: "FUNDS",
      enum: ["GCOIN", "FUNDS"],
    },
    status: {
      type: String,
      default: "PENDING",
      enum: ["PENDING", "COMPLETED", "CANCELED"],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("PaymentSession", PaymentSchema);
