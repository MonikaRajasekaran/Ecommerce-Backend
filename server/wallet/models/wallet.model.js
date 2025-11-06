const mongoose = require("mongoose");
const shortid = require("shortid");

const { Schema } = mongoose;

const Currency = new Schema({
  currencyCode: {
    type: String,
    default: "USD",
  },
  displayAs: {
    type: String,
    default: "$",
  },
});

const Wallet = new Schema({
  walletId: {
    type: String,
    default: shortid.generate,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
  currency: {
    type: Currency,
    required: true,
  },
  availableFunds: {
    type: Number,
    default: 0,
  },
  gCoins: {
    type: Number,
    default: 0,
  },
  isDefault: {
    type: Boolean,
    default: true,
  },
});

Wallet.index({ walletId: 1 });
Wallet.index({ userId: 1, isDefault: true }, { unique: true });

module.exports = mongoose.model("Wallet", Wallet);
