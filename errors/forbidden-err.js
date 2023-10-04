const {
  ForbiddenErrorCode,
} = require('./errorCodes');

class ForbiddenError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = ForbiddenErrorCode;
  }
}

module.exports = ForbiddenError;
