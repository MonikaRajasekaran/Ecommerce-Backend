const fs = require("fs");
const httpStatus = require("http-status");
const _ = require("lodash");
const config = require("../../../config/config");
const $ = require("mongo-dot-notation");
const shortId = require("shortid");

const service = require("../services/profile.service");
const CONSTANTS = require("../../helpers/Constants");
const APIError = require("../../helpers/APIError.helper");
const resourceService = require("../../resources/services/resources.service");
const logger = require("../../../config/winston")(module);


module.exports.get = async (req, res, next) => {
  const { user } = req;
  const userId = user.sub
  try {
    const data = await service.get({ userId });
    if (data) {
      return res
        .status(httpStatus.OK)
        .json(data);
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

module.exports.getAllProfile = async (req, res, next) => {
  const { query, user } = req;

  try {
    const { limit, skip, page } = query;
    const payload = helpers.omitFields(query, ["limit", "skip", "page"]);
    const counts = await helpers.pager(
      limit,
      skip,
      page,
      await service.getCount(payload)
    );
    const { itemCount, currentPage, totalPages } = counts;

    service
      .getAll(payload, counts.skipTo, counts.limitUntil)
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

module.exports.patch = async (req, res, next) => {
  const { user, params, body } = req;
  const query = { ...params };
  try {
    const data = await service.patch(query, body);
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
