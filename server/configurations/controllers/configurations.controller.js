const httpStatus = require("http-status");
const _ = require("lodash");

const service = require("../services/configurations.service");
const helpers = require("../../helpers/helpers");
const APIError = require("../../helpers/APIError.helper");
const CONSTANTS = require("../../helpers/Constants");
const logger = require("../../../config/winston")(module);

module.exports.create = async (req, res, next) => {
  const { body, user } = req;
  body.visitorId = user.userId;
  try {
    const data = await service.create(body);
    if (data) {
      return res
        .status(httpStatus.CREATED)
        .json({ msg: "Successfully Created" });
    }
    const code = `Err${CONSTANTS.MODULE_CODE.CONFIGURATION}${CONSTANTS.OPERATION_CODE.CREATE}${CONSTANTS.ERROR_TYPE.GENERIC}1`;
    logger.log({
      level: "info",
      message: `Failed to Create ${code}`,
    });
    return next(
      new APIError(
        "Failed to Create",
        httpStatus.BAD_REQUEST,
        true,
        res.__("failed_to_create"),
        code
      )
    );
  } catch (e) {
    const code = `Err${CONSTANTS.MODULE_CODE.CONFIGURATION}${CONSTANTS.OPERATION_CODE.CREATE}${CONSTANTS.ERROR_TYPE.SYSTEM}1`;
    return next(
      new APIError(e.message, e.status, true, res.__("system_error"), code)
    );
  }
};

module.exports.getConfigurationData = async (req, res, next) => {
  const { query } = req;
  try {
    const data = await service.fetchOne(query);
    if (data) {
      return res.status(httpStatus.OK).json({ data });
    }
    const code = `Err${CONSTANTS.MODULE_CODE.CONFIGURATION}${CONSTANTS.OPERATION_CODE.READ}${CONSTANTS.ERROR_TYPE.GENERIC}1`;
    logger.log({
      level: "info",
      message: `Failed to Get ${code}`,
    });
    return next(
      new APIError(
        "Failed to Get",
        httpStatus.BAD_REQUEST,
        true,
        res.__("failed_to_get"),
        code
      )
    );
  } catch (e) {
    const code = `Err${CONSTANTS.MODULE_CODE.CONFIGURATION}${CONSTANTS.OPERATION_CODE.READ}${CONSTANTS.ERROR_TYPE.SYSTEM}1`;
    return next(
      new APIError(e.message, e.status, true, res.__("system_error"), code)
    );
  }
};
