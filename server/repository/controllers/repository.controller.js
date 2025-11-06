const httpStatus = require("http-status");
const Constants = require("../../helpers/Constants");
const resourceService = require("../../resources/services/resources.service");
const APIError = require("../../helpers/APIError.helper");
const logger = require("../../../config/winston")(module);

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


module.exports.accessAwsData = async (req, res, next) => {
  const { params, S3, organisation } = req;
  const resourceId = params.resourceId.replace(/\.[^/.]+$/, "");
  try {
    const resource = await resourceService.getFileById({ resourceId });
    if (resource && "resourceId" in resource) {
      const s3Stream = await resourceService.getAwsData(
        S3,
        resource.file.Bucket,
        resource.file.Key
      );
      const type = resource.fileType.split("/");
      s3Stream.on("error", (err) => {
        const code = `Err${Constants.MODULE_CODE.RESOURCE}${Constants.OPERATION_CODE.READ}${Constants.ERROR_TYPE.SYSTEM}2`;
        return next(
          new APIError(
            err.message,
            httpStatus.UNPROCESSABLE_ENTITY,
            true,
            res.__("system_error"),
            code
          )
        );
      });
      res.set("Content-Type", `image/${type[1]}`);
      s3Stream
        .pipe(res)
        .on("error", (err) => {
          const code = `Err${Constants.MODULE_CODE.RESOURCE}${Constants.OPERATION_CODE.READ}${Constants.ERROR_TYPE.SYSTEM}1`;
          return next(
            new APIError(
              err.message,
              httpStatus.UNPROCESSABLE_ENTITY,
              true,
              res.__("system_error"),
              code
            )
          );
        })
        .on("close", (data) => res.status(httpStatus.OK).send(data));
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
