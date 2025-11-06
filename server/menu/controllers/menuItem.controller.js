const _ = require("lodash");

const httpStatus = require("http-status");
const menuItemService = require("../services/menuItem.service");
const APIError = require("../../helpers/APIError.helper");
const helpers = require("../../helpers/helpers");
const logger = require("../../../config/winston")(module);
const awshelper = require("../../helpers/aws.helper");
const Order = require('../../order/models/order.model');
const Menu = require('../models/menuItem.model');
// Updated helper function to create a username with 5 to 10 characters

module.exports.createmenuItem = async (req, res, next) => {
  const { body, user, organisation } = req;
  body.createdBy = user.sub;
  if (organisation?.orgId) {
    body.orgId = organisation.orgId;
  }
  try {
    const data = await menuItemService.create(body);
    if (data) {
      return res.status(httpStatus.OK).json(data);
    }
    logger.log({
      level: "info",
      message: `Failed to Create`,
    });
    return next(
      new APIError(
        "Failed to Create",
        httpStatus.BAD_REQUEST,
        true,
        res.__("failed_to_create")
      )
    );
  } catch (e) {
    return next(
      new APIError(e.message, e.status, true, res.__("system_error"))
    );
  }
};

module.exports.getmenuItem = async (req, res, next) => {
  const { query, user , organisation } = req;

  try {
    const { limit, skip, page } = query;
    const payload = _.omit(query, ["limit", "skip", "page"]);
    if (organisation?.orgId) {
        payload.orgId = organisation.orgId;
      }
    // Get count of tables
    const counts = await helpers.pager(
      limit,
      skip,
      page,
      await menuItemService.getmenuItemCount(payload)
    );
    const { itemCount, currentPage, totalPages } = counts;

    // Fetch tables with populated currentOrder if exists
    menuItemService
      .get(payload, counts.skipTo, counts.limitUntil)
      .then((response) => {
        // Populate the current order for each table
        response.forEach((table) => {
          if (table.currentOrder) {
            // If the table has a currentOrder, fetch the order details
            Order.findOne({ orderId: table.currentOrder })
              .then((order) => {
                table.currentOrderDetails = order; // Add the order details to the table object
              })
              .catch((err) => {
                console.error(err);
              });
          }
        });

        res.status(httpStatus.OK).send({
          success: true,
          response,
          itemCount,
          currentPage,
          totalPages,
        });
      })
      .catch((e) => {
        next(new APIError(e.message, e.status, true, "Error"));
      });
  } catch (e) {
    next(new APIError(e.message, e.status, true, "Error"));
  }
};

module.exports.getmenuItemById = async (req, res, next) => {
  const { user, params, organisation } = req;
  const payload = { ...params };
  if (organisation?.orgId) {
    payload.orgId = organisation.orgId;
  }
  try {
    const data = await menuItemService.getmenuItembyId(payload, 0, 50);
    if (data) {
      return res.status(httpStatus.OK).json(data);
    }
    logger.log({
      level: "info",
      message: `Failed to Get`,
    });
    return next(
      new APIError(
        "Failed to Get",
        httpStatus.BAD_REQUEST,
        true,
        res.__("failed_to_get")
      )
    );
  } catch (e) {
    return next(
      new APIError(e.message, e.status, true, res.__("system_error"))
    );
  }
};

module.exports.patchmenuItem = async (req, res, next) => {
  const { user, params, body } = req;
  const query = { ...params };
  try {
    const data = await menuItemService.patch(query, body);
    if (data) {
      return res.status(httpStatus.OK).json(data);
    }
    logger.log({
      level: "info",
      message: `Failed to Patch`,
    });
    return next(
      new APIError(
        "Failed to Patch",
        httpStatus.BAD_REQUEST,
        true,
        res.__("failed_to_get")
      )
    );
  } catch (e) {
    return next(
      new APIError(e.message, e.status, true, res.__("system_error"))
    );
  }
};

module.exports.deletemenuItem = async (req, res, next) => {
  const { user, params } = req;
  const payload = { ...params };
  try {
    const data = await menuItemService.delete(payload);
    if (data) {
      return res.status(httpStatus.OK).json({
        success: true,
      });
    }
    logger.log({
      level: "info",
      message: `Failed to Get`,
    });
    return next(
      new APIError(
        "Failed to Get",
        httpStatus.BAD_REQUEST,
        true,
        res.__("failed_to_get")
      )
    );
  } catch (e) {
    return next(
      new APIError(e.message, e.status, true, res.__("system_error"))
    );
  }
};


module.exports.getPopularItems = async (req, res, next) => {
  try {
    const menuLimit = req.query.limit ? parseInt(req.query.limit) : 10;
    const {organisation} = req;

    const popularItems = await menuItemService.getPopularItems(menuLimit, organisation?.orgId);
    return res.status(httpStatus.OK).json({
      success: true,
      data: popularItems,
      message: "Popular items retrieved successfully"
    });
  } catch (e) {
    return next(
      new APIError(
        e.message,
        e.status || httpStatus.INTERNAL_SERVER_ERROR,
        true,
        res.__("system_error")
      )
    );
  }
};
