const Promise = require("bluebird");
const httpStatus = require("http-status");
const mongoose = require("mongoose");
const _ = require("lodash");
const database = require("../../helpers/db.helper");
require("../models/units.model");

const Unit = mongoose.model("Units");
const APIError = require("../../helpers/APIError.helper");

module.exports.create = (data) => {
  return new Promise((resolve, reject) => {
    database
      .save(Unit, data)
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
      .list(Unit, query, { skip, limit })
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
      .updateDoc(Unit, query, payload)
      .then((response) => {
        return resolve(response);
      })
      .catch((e) => {
        return reject(e);
      });
  });
};

module.exports.getUnitbyId = (query, skip = 0, limit = 50) => {
  return new Promise((resolve, reject) => {
    database
      .getOneDoc(Unit, query)
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
      .getOneDoc(Unit, query) // Only pass the config and query
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
      .deleteOne(Unit, query)
      .then((response) => {
        return resolve(response);
      })
      .catch((e) => {
        return reject(new APIError(e));
      });
  });
};

module.exports.getUnitCount = async (query = {}) => {
    const count = await Unit.countDocuments(query);
    return count;
};

module.exports.searchUnit = (query, skip = 0, limit = 50) => {
  return new Promise((resolve, reject) => {
    database
      .regSearch(Unit, query, { skip, limit })
      .then((response) => {
        return resolve(response);
      })
      .catch((e) => {
        return reject(new APIError(e));
      });
  });
};

