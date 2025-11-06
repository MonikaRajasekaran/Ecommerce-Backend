const mongoose = require("mongoose");
const _ = require("lodash");
const database = require("../../helpers/db.helper");

require("../models/paymentSession.model");

const model = mongoose.model("PaymentSession");

module.exports.createPaymentSession = (data) =>
  new Promise((resolve, reject) => {
    database
      .save(model, data)
      .then((response) => {
        return resolve(response);
      })
      .catch((e) => {
        return reject(e);
      });
  });

module.exports.getPaymentById = (data) => {
  return new Promise((resolve, reject) => {
    database
      .getOneDoc(model, data, {
        _id: 0,
        __v: 0,
      })
      .then((response) => resolve(response))
      .catch((e) => reject(e));
  });
};

module.exports.updatePaymentSession = (filter, payload) => {
  return new Promise((resolve, reject) => {
    database
      .updateDoc(model, filter, payload)
      .then((response) => {
        return resolve(response);
      })
      .catch((e) => {
        return reject(e);
      });
  });
};
