/* eslint-disable global-require */
const mongoose = require("mongoose");
const database = require("../../helpers/db.helper");
const config = require("../../../config/config");
const logger = require("../../../config/winston")(module);

require("../models/payments.model");

const Payments = mongoose.model("Payments");
const helpers = require("../../helpers/helpers");
const APIError = require("../../helpers/APIError.helper");
const CONSTANTS = require("../../helpers/Constants");
const decrypter = require("../../helpers/decrypter.helper");

let stripe;
(async () => {
  stripe = require("stripe")(
    decrypter.decrypt(config.extras.stripe_shared_secret)
  );
})();

module.exports.createStripePaymentSession = async (payload) => {
  try {
    const session = await stripe.checkout.sessions.create(payload);
    return session;
  } catch (e) {
    throw e;
  }
};

module.exports.fetchBalancetxn = async (id) => {
  try {
    const balanceTransaction = await stripe.balanceTransactions.retrieve(id);
    return balanceTransaction;
  } catch (e) {
    throw e;
  }
};

module.exports.createPayment = (data) =>
  new Promise((resolve, reject) => {
    database
      .save(Payments, data)
      .then((response) => {
        return resolve(response);
      })
      .catch((e) => {
        return reject(e);
      });
  });

module.exports.getPayments = (query = {}, skip = 0, limit = 50) =>
  new Promise((resolve, reject) => {
    database
      .list(Payments, query, { skip, limit }, { name: 1 })
      .then((response) => resolve(response))
      .catch((e) => {
        logger.error(`fetch Service Error: ${JSON.stringify(e)}`);
        reject(e);
      });
  });

module.exports.getCount = async (query = {}) => {
  const count = await Payments.countDocuments(query);
  return count;
};
