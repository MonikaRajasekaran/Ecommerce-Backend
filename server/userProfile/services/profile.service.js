const mongoose = require("mongoose");
const database = require("../../helpers/db.helper");

require("../models/profile.model");

const Model = mongoose.model("Profile");

module.exports.create = (data) =>
  new Promise((resolve, reject) => {
    database
      .save(Model, data)
      .then((response) => {
        return resolve(response);
      })
      .catch((e) => {
        return reject(e);
      });
  });

module.exports.get = (query) =>
  new Promise((resolve, reject) => {
    database
      .getOneDoc(Model, query, {
        _id: 0,
        __v: 0,
      })
      .then((response) => {
        return resolve(response);
      })
      .catch((e) => {
        return reject(e);
      });
  });

module.exports.getAll = (data, skip = 0, limit = 300) => {
  return new Promise((resolve, reject) => {
    database
      .list(Model, data, { skip, limit })
      .then((response) => {
        return resolve(response);
      })
      .catch((e) => {
        return reject(e);
      });
  });
};

module.exports.patch = (filter, payload) => {
  return new Promise((resolve, reject) => {
    database
      .updateDoc(Model, filter, payload)
      .then((response) => {
        return resolve(response);
      })
      .catch((e) => {
        return reject(e);
      });
  });
};

module.exports.getCount = async (query = {}) => {
  const count = await Model.countDocuments(query);
  return count;
};

module.exports.delete = (query) =>
  new Promise((resolve, reject) => {
    database
      .deleteOne(Model, query)
      .then((response) => resolve(response))
      .catch((e) => {
        reject(e);
      });
  });