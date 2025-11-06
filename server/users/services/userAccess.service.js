const mongoose = require("mongoose");
const database = require("../../helpers/db.helper");
require("../models/userAccess.model");

const Model = mongoose.model("UserAccess");

module.exports.createAccess = (data) =>
  new Promise((resolve, reject) => {
    database
      .save(Model, data)
      .then((response) => resolve(response))
      .catch((e) => reject(e));
  });

module.exports.getAccessData = (query) =>
  new Promise((resolve, reject) => {
    database
      .getOneDoc(Model, query)
      .then((response) => resolve(response))
      .catch((e) => reject(e));
  });

module.exports.fetch = (query = {}, skip = 0, limit = 50) =>
  new Promise((resolve, reject) => {
    database
      .list(Model, query, { skip, limit })
      .then((response) => resolve(response))
      .catch((e) => reject(e));
  });

module.exports.fetchOne = (query) =>
  new Promise((resolve, reject) => {
    database
      .getOneDoc(Model, query, {
        _id: 0,
        __v: 0,
        hashedPassword: 0,
        salt: 0,
      })
      .then((response) => resolve(response))
      .catch((e) => reject(e));
  });

module.exports.patch = (query, payload) =>
  new Promise((resolve, reject) => {
    database
      .updateDoc(Model, query, payload)
      .then((response) => resolve(response))
      .catch((e) => reject(e));
  });

module.exports.delete = (query) =>
  new Promise((resolve, reject) => {
    database
      .deleteOne(Model, query)
      .then((response) => resolve(response))
      .catch((e) => reject(e));
  });
