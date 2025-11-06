/* eslint-disable import/order */
const mongoose = require("mongoose");
const decrypter = require("../../helpers/decrypter.helper");
const config = require("../../../config/config");

const stripe = require("stripe")(
  decrypter.decrypt(config.extras.stripe_shared_secret)
);

const database = require("../../helpers/db.helper");
const logger = require("../../../config/winston")(module);
const CONSTANTS = require("../../helpers/Constants");

require("../models/stripe.model");

const model = mongoose.model("Stripe");

module.exports.getConnectedAccounts = (data, skip = 0, limit = 50) => {
  return new Promise((resolve, reject) => {
    database
      .list(model, data, { skip, limit })
      .then((response) => {
        return resolve(response);
      })
      .catch((e) => {
        return reject(e);
      });
  });
};

module.exports.getMyConnectedAccounts = (data) => {
  return new Promise((resolve, reject) => {
    database
      .getOneDoc(model, data)
      .then((response) => {
        return resolve(response);
      })
      .catch((e) => {
        return reject(e);
      });
  });
};

module.exports.createConnectedMap = (payload) => {
  return new Promise((resolve, reject) => {
    database
      .save(model, payload)
      .then((response) => {
        return resolve(response);
      })
      .catch((e) => {
        return reject(e);
      });
  });
};

module.exports.createConnectedAccount = async (user) => {
  const account = await stripe.accounts.create({
    country: user.country,
    type: "custom",
    capabilities: {
      card_payments: {
        requested: true,
      },
      transfers: {
        requested: true,
      },
    },
  });
  return account;
};

module.exports.createExpressAccount = async (data) => {
  const account = await stripe.accounts.create(data);
  return account;
};

module.exports.createAccountLink = async (data) => {
  const account = await stripe.accountLinks.create(data);
  return account;
};

module.exports.retreiveAccount = async (id) => {
  const account = await stripe.accounts.retrieve(id);
  return account;
};
