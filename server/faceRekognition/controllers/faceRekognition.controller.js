const httpStatus = require("http-status");
const rekogntionService = require("../services/faceRekognition.service");
const resourceService = require("../../resources/services/resources.service");
const APIError = require("../../helpers/APIError.helper");
const Constants = require("../../helpers/Constants");
const config = require("../../../config/config");

module.exports.createCollection = (_, res, next) => {
  rekogntionService
    .createCollection({
      CollectionId: config.extras.rekognition.collection,
    })
    .then((response) => {
      if ("StatusCode" in response) {
        return res.status(httpStatus.CREATED).json(response);
      }
      const code = `Err${Constants.MODULE_CODE.REKOGNITION}${Constants.OPERATION_CODE.CREATE}${Constants.ERROR_TYPE.GENERIC}1`;
      return next(
        new APIError(
          "Rekognition: Collection Creation Failed",
          httpStatus.NOT_FOUND,
          true,
          res.__("registration_failed"),
          code
        )
      );
    })
    .catch((e) => {
      const code = `Err${Constants.MODULE_CODE.REKOGNITION}${Constants.OPERATION_CODE.CREATE}${Constants.ERROR_TYPE.SYSTEM}1`;
      return next(
        new APIError(e.message, e.status, true, res.__("system_error"), code)
      );
    });
};

module.exports.registerFace = async (req, res, next) => {
  const { body, user } = req;

  try {
    const resource = await resourceService.getFileById(body);
    if (resource && resource.file) {
      return rekogntionService
        .registerFace(resource.file, user.userId)
        .then((response) => {
          if ("FaceRecords" in response && response.FaceRecords.length > 0) {
            return res.status(httpStatus.CREATED).send(response);
          }
          const code = `Err${Constants.MODULE_CODE.REKOGNITION}${Constants.OPERATION_CODE.REGISTER}${Constants.ERROR_TYPE.GENERIC}1`;
          return next(
            new APIError(
              "Rekognition: Face Registration Failed",
              httpStatus.UNPROCESSABLE_ENTITY,
              true,
              res.__("registration_failed"),
              code
            )
          );
        })
        .catch((e) => {
          const code = `Err${Constants.MODULE_CODE.REKOGNITION}${Constants.OPERATION_CODE.CREATE}${Constants.ERROR_TYPE.SYSTEM}1`;
          return next(
            new APIError(
              e.message,
              e.status,
              true,
              res.__("system_error"),
              code
            )
          );
        });
    }
    const code = `Err${Constants.MODULE_CODE.REKOGNITION}${Constants.OPERATION_CODE.REGISTER}${Constants.ERROR_TYPE.GENERIC}1`;
    return next(
      new APIError(
        "Resource not Found",
        httpStatus.NOT_FOUND,
        true,
        res.__("not_found"),
        code
      )
    );
  } catch (e) {
    const code = `Err${Constants.MODULE_CODE.REKOGNITION}${Constants.OPERATION_CODE.REGISTER}${Constants.ERROR_TYPE.SYSTEM}1`;
    return next(
      new APIError(e.message, e.status, true, res.__("system_error"), code)
    );
  }
};

module.exports.compareFace = async (req, res, next) => {
  const { file } = req;
  const fileData = file.buffer;
  const base64Image = fileData.toString("base64");
  rekogntionService
    .compareFace(base64Image)
    .then((response) => {
      if ("FaceMatches" in response && response.FaceMatches.length > 0) {
        return res.status(httpStatus.CREATED).send(response);
      }
      const code = `Err${Constants.MODULE_CODE.REKOGNITION}${Constants.OPERATION_CODE.REGISTER}${Constants.ERROR_TYPE.GENERIC}1`;
      return next(
        new APIError(
          "Rekognition: No Match Found",
          httpStatus.NOT_FOUND,
          true,
          res.__("registration_failed"),
          code
        )
      );
    })
    .catch((e) => {
      const code = `Err${Constants.MODULE_CODE.REKOGNITION}${Constants.OPERATION_CODE.CREATE}${Constants.ERROR_TYPE.SYSTEM}1`;
      return next(
        new APIError(e.message, e.status, true, res.__("system_error"), code)
      );
    });
};

module.exports.deleteFaces = async (req, res, next) => {
  const { body } = req;
  rekogntionService
    .deleteFaces(body.faceIds)
    .then((response) => {
      return res.send(response);
    })
    .catch((e) => {
      const code = `Err${Constants.MODULE_CODE.REKOGNITION}${Constants.OPERATION_CODE.CREATE}${Constants.ERROR_TYPE.SYSTEM}1`;
      return next(
        new APIError(e.message, e.status, true, res.__("system_error"), code)
      );
    });
};
