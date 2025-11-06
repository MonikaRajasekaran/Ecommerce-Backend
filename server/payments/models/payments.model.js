const mongoose = require("mongoose");

const { Schema } = mongoose;
const shortid = require("shortid");

const PaymentSchema = new Schema(
  {
    paymentId: {
      type: String,
      required: true,
      default: shortid.generate,
    },
    gatewayIntentId: {
      type: String,
      required: true,
    },
    gatewayPaymentId: {
      type: String,
      required: true,
    },
    chargeObj: {
      type: Schema.Types.Mixed,
    },
    transactionObj: {
      type: Schema.Types.Mixed,
      required: true,
    },
    amountCredited: {
      type: Number,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
    gatewayfee: {
      type: Number,
      required: true,
    },
    getwayType: {
      type: String,
      default: "RAZOR",
      enum: ["RAZOR", "STRIPE"],
    },
    status: {
      type: String,
      default: "COMPLETED",
      enum: [
        "PENDING",
        "ONHOLD",
        "PARTIAL_REVERT",
        "FULL_REVERT",
        "COMPLETED",
        "CANCELED",
      ],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Payments", PaymentSchema);
