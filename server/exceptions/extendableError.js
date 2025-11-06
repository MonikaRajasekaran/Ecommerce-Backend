class ExtendableError extends Error {
  constructor(exceptions, message, errorCode, isPublic) {
    super(message);
    this.name = exceptions.title || this.constructor.name;
    this.message = message || exceptions.message;
    this.status = exceptions.httpStatus;
    this.errorCode = errorCode || exceptions.code;
    this.isPublic = isPublic;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor.name);
  }
}

module.exports = ExtendableError;
