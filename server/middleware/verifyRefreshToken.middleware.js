const jwt = require("jsonwebtoken");
const httpStatus = require("http-status");
const APIError = require("../helpers/APIError.helper");
const config = require("../../config/config");
const decrypter = require("../helpers/decrypter.helper");

exports.refreshToken = () => async (req, res, next) => {
  const { body } = req;
  const token = body.refreshToken.split(" ");
  const refreshToken = token.length > 0 ? token[token.length - 1] : null;
  if (refreshToken != null) {
    return jwt.verify(
      refreshToken,
      decrypter.decrypt(config.extras.jwt_secret),
      (err) => {
        if (err) {
          return next(
            new APIError(
              "Forbidden: Invalid Refresh Token",
              httpStatus.FORBIDDEN,
              true,
              "UnauthorizedError"
            )
          );
        }
        return next();
      }
    );
  }
  return next(
    new APIError(
      "Forbidden: Invalid Refresh Token",
      httpStatus.FORBIDDEN,
      true,
      "UnauthorizedError"
    )
  );
};
