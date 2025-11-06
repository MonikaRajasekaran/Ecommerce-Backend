const Promise = require("bluebird");
const httpStatus = require("http-status");
const mongoose = require("mongoose");
const _ = require("lodash");
const database = require("../../helpers/db.helper");
require("../models/menuItem.model");
require("../../order/models/order.model");

const menuItem = mongoose.model("menuItem");
const APIError = require("../../helpers/APIError.helper");
const Order = mongoose.model("Order");

module.exports.create = (data) => {
  return new Promise((resolve, reject) => {
    database
      .save(menuItem, data)
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
      .list(menuItem, query, { skip, limit })
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
      .updateDoc(menuItem, query, payload)
      .then((response) => {
        return resolve(response);
      })
      .catch((e) => {
        return reject(e);
      });
  });
};

module.exports.getmenuItembyId = (query, skip = 0, limit = 50) => {
  return new Promise((resolve, reject) => {
    database
      .getOneDoc(menuItem, query)
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
      .getOneDoc(menuItem, query) // Only pass the config and query
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
      .deleteOne(menuItem, query)
      .then((response) => {
        return resolve(response);
      })
      .catch((e) => {
        return reject(new APIError(e));
      });
  });
};

module.exports.getmenuItemCount = async (query = {}) => {
  const count = await menuItem.countDocuments(query);
  return count;
};

module.exports.getPopularItems = async (limit = 10, orgId=null) => {
  try {
    // Aggregate orders to find popular items
    const result = await Order.aggregate([
      { $match: orgId ? { orgId } : {} }, // Filter by orgId if provided
      { $unwind: "$items" }, // Split items array
      {
        $group: {
          _id: "$items.menuItemId",
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      { $limit: limit }, // Limit to top 3 popular items
    ]);

    // Populate menu item details
    const popularItems = await Promise.all(
      result.map(async (item) => {
        const menuItems = await menuItem.findOne({ menuItemId: item.menuItemId });
        return {
          menuItemId: item._id,
          count: item.count,
          name: menuItems?.ProductName || "Unknown",
          price: menuItems?.price || 0,
          status: menuItems?.status || "N/A",
          category: menuItems?.categoryId || "N/A",
          menuImage:menuItems?.menuImage ||"#"
        };
      })
    );

    return popularItems;
  } catch (e) {
    throw e;
  }
};
