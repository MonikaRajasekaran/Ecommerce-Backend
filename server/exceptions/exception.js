/* eslint-disable grouped-accessor-pairs */
const httpStatus = require("http-status");

class ErrorDefinition {
  constructor(title, message, httpStatus, code) {
    this.title = title;
    this.message = message;
    this.httpStatus = httpStatus;
    this.code = code;
  }
}

const GENERIC_ERROR = new ErrorDefinition(
  "System Error",
  "Internal Server Error",
  httpStatus.INTERNAL_SERVER_ERROR,
  "E-0000"
);
const NOT_FOUND_ERROR = new ErrorDefinition(
  "Not Found",
  "Data Not Found",
  httpStatus.NOT_FOUND,
  "E-0001"
);
const VALIDATION_ERROR = new ErrorDefinition(
  "Validation Failed",
  "Bad Request, Validation Failed",
  httpStatus.BAD_REQUEST,
  "E-0002"
);

const UNAUTHORIZED = new ErrorDefinition(
  "Not Authorized",
  "Request is not authorized to perform",
  httpStatus.UNAUTHORIZED,
  "E-0003"
);

module.exports = {
  GENERIC_ERROR,
  NOT_FOUND_ERROR,
  VALIDATION_ERROR,
  UNAUTHORIZED,
};
