const { validationResult } = require("express-validator");
const httpStatus = require("http-status");
const APIError = require("../../helpers/APIError.helper");

exports.check = function check() {
  return (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(
        new APIError(
          { errors: errors.array() },
          httpStatus.UNPROCESSABLE_ENTITY,
          true,
          "Validation Error"
        )
      );
    }
    return next();
  };
};
