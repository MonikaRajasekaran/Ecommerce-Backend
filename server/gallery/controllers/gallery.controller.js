const httpStatus = require("http-status");
const Constants = require("../../helpers/Constants");
const resourceService = require("../../resources/services/resources.service");
const APIError = require("../../helpers/APIError.helper");
const logger = require("../../../config/winston")(module);
const config = require("../../../config/config");
const _ = require("lodash")

/**
 * @swagger
 * tags:
 *   name: Resources
 *   description: Resource management
 */

/**
 * @swagger
 * path:
 *  /resources/{environment}/{category}/{resourceFilename}:
 *    get:
 *      summary: Upload new resource file
 *      tags: [Resources]
 *      security:
 *        - Bearer: []
 *      consumes:
 *        - "application/json"
 *        - "application/xml"
 *      produces:
 *      - "application/xml"
 *      - "application/json"
 */


module.exports.getGallery = async (req, res, next) => {
  const { S3, organisation } = req;
  try {
    const resource = await resourceService.getFiles({ orgId: organisation.orgId });
    if (resource) {
      res.status(httpStatus.OK).send(resource)
    } else {
      const code = `Err${Constants.MODULE_CODE.RESOURCE}${Constants.OPERATION_CODE.READ}${Constants.ERROR_TYPE.GENERIC}1`;
      logger.error("Resource Not found");
      next(
        new APIError(
          "Resource Not found",
          httpStatus.NOT_FOUND,
          true,
          res.__("not_found"),
          code
        )
      );
    }
  } catch (e) {
    const code = `Err${Constants.MODULE_CODE.RESOURCE}${Constants.OPERATION_CODE.UPLOAD}${Constants.ERROR_TYPE.SYSTEM}1`;
    next(new APIError(e.message, e.status, true, res.__("system_error"), code));
  }
};
