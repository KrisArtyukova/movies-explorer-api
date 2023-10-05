const {
  ForbiddenErrorCode,
} = require('./errorCodes');
const { ForbiddenErrorName } = require('./errorNames');

class ForbiddenError extends Error {
  constructor(message) {
    super(message);
    this.name = ForbiddenErrorName;
    this.statusCode = ForbiddenErrorCode;
  }
}

module.exports = ForbiddenError;
