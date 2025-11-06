const httpStatus = require("http-status");
const _ = require("lodash");

const hookService = require("../service/hooks.service");
const APIError = require("../../helpers/APIError.helper");
const CONSTANTS = require("../../helpers/Constants");
const logger = require("../../../config/winston")(module);

module.exports.hooksPayload = async (req, res, next) => {
  const { body } = req;
  try {
    if (body.object && body.object === "event") {
      await hookService.payloadParser(body);
      return res.status(httpStatus.CREATED).send("OK");
    }
    return res.status(httpStatus.BAD_REQUEST);
  } catch (e) {
    const code = `Err${CONSTANTS.MODULE_CODE.HOOKS}${CONSTANTS.OPERATION_CODE.CREATE}${CONSTANTS.ERROR_TYPE.SYSTEM}1`;
    return next(
      new APIError(e.message, e.status, true, res.__("system_error"), code)
    );
  }
};
