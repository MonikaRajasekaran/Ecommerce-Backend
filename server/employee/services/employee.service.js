const Promise = require("bluebird");
const httpStatus = require("http-status");
const mongoose = require("mongoose");
const _ = require("lodash");
const database = require("../../helpers/db.helper");
require("../models/employee.model");

const employee = mongoose.model("employee");
const APIError = require("../../helpers/APIError.helper");

module.exports.create = (data) => {
  return new Promise((resolve, reject) => {
    database
      .save(employee, data)
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
      .list(employee, query, { skip, limit })
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
      .updateDoc(employee, query, payload)
      .then((response) => {
        return resolve(response);
      })
      .catch((e) => {
        return reject(e);
      });
  });
};

module.exports.getemployeebyId = (query, skip = 0, limit = 50) => {
  return new Promise((resolve, reject) => {
    database
      .getOneDoc(employee, query)
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
      .getOneDoc(employee, query) // Only pass the config and query
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
      .deleteOne(employee, query)
      .then((response) => {
        return resolve(response);
      })
      .catch((e) => {
        return reject(new APIError(e));
      });
  });
};

module.exports.getemployeeCount = async (query = {}) => {
  const count = await employee.countDocuments(query);
  return count;
};

module.exports.searchEmployee = (query, skip = 0, limit = 50) => {
  return new Promise((resolve, reject) => {
    database
      .regSearch(employee, query, { skip, limit })
      .then((response) => {
        return resolve(response);
      })
      .catch((e) => {
        return reject(new APIError(e));
      });
  });
};
