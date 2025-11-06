const Promise = require("bluebird");
const httpStatus = require("http-status");
const mongoose = require("mongoose");
const _ = require("lodash");
const database = require("../../helpers/db.helper");
require("../models/order.model");

const Order = mongoose.model("Order");
const APIError = require("../../helpers/APIError.helper");

module.exports.create = (data) => {
  return new Promise((resolve, reject) => {
    database
      .save(Order, data)
      .then((response) => {
        return resolve(response);
      })
      .catch((e) => {
        if (e.code === 11000) {
          return reject(new APIError(e.message, httpStatus.BAD_REQUEST));
        } else {
          return reject(e);
        }
      });
  });
};

module.exports.get = (query, skip = 0, limit = 50) => {
  return new Promise((resolve, reject) => {
    database
      .list(Order, query, { skip, limit })
      .then((response) => {
        return resolve(response);
      })
      .catch((e) => {
        return reject(e);
      });
  });
};

module.exports.patch = (query, payload) => {
  return new Promise((resolve, reject) => {
    database
      .updateDoc(Order, query, payload)
      .then((response) => {
        return resolve(response);
      })
      .catch((e) => {
        return reject(e);
      });
  });
};

module.exports.getOrderbyId = (query, skip = 0, limit = 50) => {
  return new Promise((resolve, reject) => {
    database
      .getOneDoc(Order, query)
      .then((response) => {
        return resolve(response);
      })
      .catch((e) => {
        return reject(new APIError(e));
      });
  });
};

module.exports.getSingleDoc = (query) => {
  return new Promise((resolve, reject) => {
    database
      .getOneDoc(Order, query) // Only pass the config and query
      .then((response) => {
        return resolve(response);
      })
      .catch((e) => {
        return reject(e);
      });
  });
};
module.exports.delete = (query) => {
  return new Promise((resolve, reject) => {
    database
      .deleteOne(Order, query)
      .then((response) => {
        return resolve(response);
      })
      .catch((e) => {
        return reject(new APIError(e));
      });
  });
};

module.exports.getOrderCount = async (query = {}) => {
  const count = await Order.countDocuments(query);
  return count;
};

