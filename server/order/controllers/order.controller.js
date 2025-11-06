const _ = require("lodash");

const httpStatus = require("http-status");
const orderService = require("../services/order.service");
const APIError = require("../../helpers/APIError.helper");
const helpers = require("../../helpers/helpers");
const logger = require("../../../config/winston")(module);
const awshelper = require("../../helpers/aws.helper");

// Updated helper function to create a username with 5 to 10 characters

module.exports.createOrder = async (req, res, next) => {
  const { body, user, organisation } = req;
  body.createdBy = user.sub;
  if (organisation?.orgId) {
    body.orgId = organisation.orgId;
  }

  try {
    // Check if order with same orderId exists
    const existingOrder = await orderService.getSingleDoc({ 'order.id': body.order?.id });
    
    if (existingOrder) {
      return res.status(httpStatus.OK).json(existingOrder);
    }

    const data = await orderService.create(body);
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
module.exports.getOrder = async (req, res, next) => {
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
      await orderService.getOrderCount(payload)
    );
    const { itemCount, currentPage, totalPages } = counts;

    // Fetch tables with populated currentOrder if exists
    orderService
      .get(payload, counts.skipTo, counts.limitUntil)
      .then((response) => {
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

module.exports.getOrderById = async (req, res, next) => {
  const { user, params, organisation } = req;
  const payload = { ...params };
  if (organisation?.orgId) {
    payload.orgId = organisation.orgId;
  }
  try {
    const data = await orderService.getOrderbyId(payload, 0, 50);
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

module.exports.patchOrder = async (req, res, next) => {
  const { user, params, body } = req;
  const query = { ...params };
  try {
    const data = await orderService.patch(query, body);
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

module.exports.deleteOrder = async (req, res, next) => {
  const { user, params } = req;
  const payload = { ...params };
  try {
    const data = await orderService.delete(payload);
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



