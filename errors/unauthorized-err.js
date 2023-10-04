const {
  UnauthorizedErrorCode,
} = require('./errorCodes');

class UnauthorizedError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = UnauthorizedErrorCode;
  }
}

module.exports = UnauthorizedError;
