const httpStatus = require("http-status");
const APIError = require("../../helpers/APIError.helper");
const CONSTANTS = require("../../helpers/Constants");
const userAccessService = require("../services/userAccess.service");

module.exports.logout = async (req, res, next) => {
  const { headers } = req;
  const { authorization } = headers;
  try {
    if (authorization && authorization.split(" ")[0] === "Bearer") {
      const tokenArray = authorization.split(" ");
      const query = {
        sessions: {
          $elemMatch: { accessToken: tokenArray[1], status: true },
        },
        isBlocked: false,
      };
      const access = await userAccessService.getAccessData(query);
      if (access != null) {
        const payload = { $pull: { sessions: { accessToken: tokenArray[1] } } };
        const status = await userAccessService.patch(query, payload);
        if (status) {
          res.status(httpStatus.OK).send({ message: "Successfully Logout" });
        } else {
          return next(
            new APIError(
              "Unprocessable Entity",
              httpStatus.UNPROCESSABLE_ENTITY,
              true,
              "Unprocessable Entity"
            )
          );
        }
      }
      return next(
        new APIError(
          "Access data not found",
          httpStatus.NOT_FOUND,
          true,
          "Not Found"
        )
      );
    }
  } catch (e) {
    const code = `Err${CONSTANTS.MODULE_CODE.SASSPASS}${CONSTANTS.OPERATION_CODE.CREATE}${CONSTANTS.ERROR_TYPE.SYSTEM}1`;
    return next(
      new APIError(e.message, e.status, true, res.__("system_error"), code)
    );
  }
};
