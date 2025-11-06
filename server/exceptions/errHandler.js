const ExtendableError = require("./extendableError");

class errHandler extends ExtendableError {
  constructor({ exceptions, message, errorCode, isPublic = false }) {
    super(exceptions, message, errorCode, isPublic);
  }
}

module.exports = errHandler;
