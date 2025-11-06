class throwHandler extends Error {
  constructor(e) {
    super(e.message);
    this.name = e.title || this.constructor.name;
    this.message = e.message;
    this.status = e.httpStatus;
    this.isPublic = true;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor.name);
  }
}

module.exports = throwHandler;
