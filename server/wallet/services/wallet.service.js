const mongoose = require("mongoose");
const database = require("../../helpers/db.helper");
require("../models/wallet.model");

const Wallet = mongoose.model("Wallet");

module.exports.getWalletByWalletId = (data) => {
  return new Promise((resolve, reject) => {
    database
      .getOneDoc(Wallet, data, {
        _id: 0,
        __v: 0,
      })
      .then((response) => resolve(response))
      .catch((e) => reject(e));
  });
};

module.exports.getWallet = function getWallet(data, skip = 0, limit = 50) {
  return new Promise((resolve, reject) => {
    database
      .list(Wallet, data, { skip, limit })
      .then((response) => {
        return resolve(response);
      })
      .catch((e) => {
        return reject(e);
      });
  });
};

module.exports.createWallet = (payload) => {
  return new Promise((resolve, reject) => {
    database
      .save(Wallet, payload)
      .then((response) => {
        return resolve(response);
      })
      .catch((e) => {
        return reject(e);
      });
  });
};

module.exports.updateWallet = (filter, payload) => {
  return new Promise((resolve, reject) => {
    database
      .updateDoc(Wallet, filter, payload)
      .then((response) => {
        return resolve(response);
      })
      .catch((e) => {
        return reject(e);
      });
  });
};

module.exports.addFund = (walletId, amount) => {
  const payload = { $inc: { availableFunds: amount } };
  return this.updateWallet({ walletId }, payload);
};

module.exports.deductFunds = (walletId, amount) => {
  const payload = { $inc: { availableFunds: -amount } };
  return this.updateWallet({ walletId }, payload);
};

module.exports.deductFundsByUserId = (userId, amount) => {
  const payload = { $inc: { availableFunds: -amount } };
  return this.updateWallet({ userId }, payload);
};
module.exports.addFundByUserId = (userId, amount) => {
  const payload = { $inc: { availableFunds: amount } };
  return this.updateWallet({ userId, isDefault: true }, payload);
};
