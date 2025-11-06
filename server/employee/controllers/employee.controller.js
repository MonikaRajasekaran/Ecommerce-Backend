const _ = require("lodash");

const httpStatus = require("http-status");
const employeeService = require("../services/employee.service");
const APIError = require("../../helpers/APIError.helper");
const helpers = require("../../helpers/helpers");
const logger = require("../../../config/winston")(module);
const awshelper = require("../../helpers/aws.helper");
const profileService = require("../../userProfile/services/profile.service");
const organisationService = require('../../organisation/services/organisation.service');

// Updated helper function to create a username with 5 to 10 characters
function generateUsername(firstName, lastName) {
  const firstInitial = lastName.charAt(0).toLowerCase();
  const lastPart = firstName.substring(0, Math.min(9, firstName.length)).toLowerCase();
  let username = firstInitial + lastPart;
  // Ensure the username is at least 5 characters long
  if (username.length < 5) {
    username = username.padEnd(5, 'x'); // Pad with 'x' if needed
  }
  return username;
}

module.exports.createEmployee = async (req, res, next) => {
  const { body, user } = req;
  body.createdBy = user.sub;
  try {
    const data = await employeeService.create(body);
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

module.exports.getEmployee = async (req, res, next) => {
  const { query, user, organisation } = req;
  query.orgId = organisation.orgId;

  try {
    const { limit, skip, page } = query;
    const payload = _.omit(query, ["limit", "skip", "page"]);
    if (organisation?.orgId) {
      payload.orgId = organisation.orgId;
    }
    const counts = await helpers.pager(
      limit,
      skip,
      page,
      await employeeService.getemployeeCount(payload)
    );
    const { itemCount, currentPage, totalPages } = counts;

    employeeService
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

module.exports.getEmployeeById = async (req, res, next) => {
  const { user, params, organisation } = req;
  const payload = { ...params };
  if (organisation?.orgId) {
    payload.orgId = organisation.orgId;
  }
  try {
    const data = await employeeService.getemployeebyId(payload, 0, 50);
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

module.exports.patchEmployee = async (req, res, next) => {
  const { user, params, body } = req;
  const query = { ...params };
  query.createdBy = user.sub;
  try {
    const data = await employeeService.patch(query, body);
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

  // employeeService.patch(query, body).then((response) => {
  //   res.status(httpStatus.OK).send({
  //     success: true,
  //     response,
  //   });
  // }).catch((e) => {
  //   next(new APIError(e.message, e.status, true, 'Error'));
  // });
};

module.exports.deleteEmployee = async (req, res, next) => {
  const { user, params } = req;
  const payload = { ...params };
  payload.createdBy = user.sub;
  try {
    const data = await employeeService.delete(payload);
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

module.exports.searchEmployee = async (req, res, next) => {
  const { query, user, organisation } = req;

  try {
    const { limit, skip, page, searchText } = query;
    // Create a regex pattern for the search text, case-insensitive
    const searchCondition = searchText
      ? { firstName: { $regex: searchText, $options: "i" } } // 'i' for case-insensitive
      : {};

    const payload = _.omit(query, ["limit", "skip", "page", "searchText"]);
    if (organisation?.orgId) {
      payload.orgId = organisation.orgId;
    }
    const searchPayload = { ...payload, ...searchCondition };

    const counts = await helpers.pager(
      limit,
      skip,
      page,
      await employeeService.getemployeeCount(searchPayload)
    );
    const { itemCount, currentPage, totalPages } = counts;

    employeeService
      .searchEmployee(searchPayload, counts.skipTo, counts.limitUntil)
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
