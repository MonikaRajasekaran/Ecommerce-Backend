const fs = require("fs");
const shortId = require("shortid");
const httpStatus = require("http-status");
const CONSTANTS = require("../../helpers/Constants");
const config = require("../../../config/config");
const resourceService = require("../services/resources.service");
const APIError = require("../../helpers/APIError.helper");
const logger = require("../../../config/winston")(module);

module.exports.uploadFile = (req, res, next) => {
  const { body, file, user, S3, organisation } = req;
  const sid = shortId.generate();
  const tmpPath = req.safePath;
  const contentType = file.mimetype;
  const image = fs.createReadStream(tmpPath);
  const directory = body.category || "default";
  const type = contentType.split("/");
  const randomName = type.length > 1 ? `${sid}.${type[1]}` : `${sid}.png`;
  const params = {
    Bucket: `${config.extras.aws.bucket}/${config.app.name}/${process.env.ENV}/${directory}`,
    Key: `${randomName}`,
    Body: image,
    ContentType: contentType,
  };
  logger.info(`uploadFile Controller Start: ${JSON.stringify(params)}`);
  resourceService
    .uploadToAWS(S3, params)
    .then(async (resource) => {
      if (resource && "Location" in resource) {
        const payload = {
          fileName: `${resource.Key}`,
          fileType: contentType,
          file: resource,
          imageURL: `${config.extras.cloudFront}${resource.Key}`,
          createdBy: user.sub,
          category: directory,
          orgId: organisation.orgId,
          resourceId: sid,
        };
        const savedData = await resourceService.saveToCollection(payload);
        try {
          fs.unlinkSync(req.safePath);
        } catch (err) {
          logger.error(`uploadFile Controller Error: ${JSON.stringify(err)}`);
        }

        return res.status(httpStatus.CREATED).json({
          imageURL: savedData.imageURL,
          awsUrl: savedData.file.Location,
          createdBy: savedData.createdBy,
          category: savedData.category,
          resourceId: savedData.resourceId,
        });
      }
      const code = `Err${CONSTANTS.MODULE_CODE.RESOURCE}${CONSTANTS.OPERATION_CODE.UPLOAD}${CONSTANTS.ERROR_TYPE.GENERIC}1`;
      logger.error(
        `uploadFile Controller Error: Failed to upload resource file`
      );
      return next(
        new APIError(
          "Failed to upload resource file",
          httpStatus.UNPROCESSABLE_ENTITY,
          true,
          res.__("update_failed"),
          code
        )
      );
    })
    .catch((e) => {
      logger.error(`uploadFile Controller Catch: ${JSON.stringify(e)}`);
      return next(
        new APIError(e.message, e.status, true, res.__("system_error"), "code")
      );
    });
};

