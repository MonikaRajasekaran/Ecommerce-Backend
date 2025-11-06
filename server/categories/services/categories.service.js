const Promise = require("bluebird");
const httpStatus = require("http-status");
const mongoose = require("mongoose");
const _ = require("lodash");
const database = require("../../helpers/db.helper");
require("../models/categories.model");

const Category = mongoose.model("Categories");
const APIError = require("../../helpers/APIError.helper");

module.exports.create = (data) => {
  return new Promise((resolve, reject) => {
    database
      .save(Category, data)
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
      .list(Category, query, { skip, limit })
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
      .updateDoc(Category, query, payload)
      .then((response) => {
        return resolve(response);
      })
      .catch((e) => {
        return reject(e);
      });
  });
};

module.exports.getCategorybyId = (query, skip = 0, limit = 50) => {
  return new Promise((resolve, reject) => {
    database
      .getOneDoc(Category, query)
      .then((response) => {
        return resolve(response);
      })
      .catch((e) => {
        return reject(new APIError(e));
      });
  });
};

module.exports.delete = (query) => {
  return new Promise((resolve, reject) => {
    database
      .deleteOne(Category, query)
      .then((response) => {
        return resolve(response);
      })
      .catch((e) => {
        return reject(new APIError(e));
      });
  });
};

module.exports.getCategoryCount = async (query = {}) => {
    const count = await Category.countDocuments(query);
    return count;
};

module.exports.searchCategory = (query, skip = 0, limit = 50) => {
  return new Promise((resolve, reject) => {
    database
      .regSearch(Category, query, { skip, limit })
      .then((response) => {
        return resolve(response);
      })
      .catch((e) => {
        return reject(new APIError(e));
      });
  });
};

module.exports.getCategoriesWithServices = (
  query = {},
  skip = 0,
  limit = 50
) => {
  return new Promise((resolve, reject) => {
    Category.aggregate([
      { $match: query },
      {
        $lookup: {
          from: "ourservices", // Use the actual name of your collection here
          let: { catId: { $toLower: "$categoriesId" } },
          pipeline: [
            {
              $match: {
                $expr: { $eq: [{ $toLower: "$categoriesId" }, "$$catId"] },
              },
            },
          ],
          as: "services",
        },
      },
      {
        $project: {
          _id: 0,
          name: 1,
          categoriesId: 1,
          services: 1,
        },
      },
      { $skip: skip },
      { $limit: limit },
    ])
      .then((response) => resolve(response))
      .catch((e) => reject(e));
  });
};
