const mongoose = require("mongoose");
const shortid = require("shortid");

const { Schema } = mongoose;

const Stripe = new Schema({
  stripeId: {
    type: String,
    default: shortid.generate,
    required: true,
  },
  connectedAccountId: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
  isDefault: {
    type: Boolean,
    default: true,
  },
});

Stripe.index({ walletId: 1 });
Stripe.index({ userId: 1, connectedAccountId: 1 }, { unique: true });

module.exports = mongoose.model("Stripe", Stripe);
