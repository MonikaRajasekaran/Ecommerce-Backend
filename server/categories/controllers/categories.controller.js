const _ = require("lodash");

const httpStatus = require("http-status");
const categoriesService = require("../services/categories.service");
const APIError = require("../../helpers/APIError.helper");
const helpers = require("../../helpers/helpers");
const logger = require("../../../config/winston")(module);

module.exports.createCategory = async (req, res, next) => {
  console.log(req.body);
  const { body, user, organisation } = req;
  body.createdBy = user.sub;
  body.orgId = organisation.orgId;
  try {
    const data = await categoriesService.create(body);
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

module.exports.getCategory = async (req, res, next) => {
  const { query, user, organisation } = req;

  try {
    const { limit, skip, page } = query;
    const payload = _.omit(query, ["limit", "skip", "page"]);
    
    if (organisation) {``
      payload.orgId = organisation.orgId;
    }    const counts = await helpers.pager(
      limit,
      skip,
      page,
      await categoriesService.getCategoryCount(payload)
    );
    const { itemCount, currentPage, totalPages } = counts;

    categoriesService
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

module.exports.getCategoryById = async (req, res, next) => {
  const { user, params, organisation } = req;
  const payload = { ...params };
  if (organisation?.orgId) {
    payload.orgId = organisation.orgId;
  }
  try {
    const data = await categoriesService.getCategorybyId(payload, 0, 50);
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

module.exports.patchCategory = async (req, res, next) => {
  const { user, params, body } = req;
  const query = { ...params };
  // query.createdBy = user.sub;
  try {
    const data = await categoriesService.patch(query, body);
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

module.exports.deleteCategory = async (req, res, next) => {
  const { user, params } = req;
  const payload = { ...params };
  payload.createdBy = user.sub;
  try {
    const data = await categoriesService.delete(payload);
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

  // categoriesService.delete(query).then((response) => {
  //   res.status(httpStatus.OK).send({
  //     success: true,
  //     response,
  //   });
  // }).catch((e) => {
  //   next(new APIError(e.message, e.status, true, 'Error'));
  // });
};