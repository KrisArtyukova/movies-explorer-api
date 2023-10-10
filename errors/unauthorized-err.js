const {
  UnauthorizedErrorCode,
} = require('./errorCodes');
const { UnauthorizedErrorName } = require('./errorNames');

class UnauthorizedError extends Error {
  constructor(message) {
    super(message);
    this.name = UnauthorizedErrorName;
    this.statusCode = UnauthorizedErrorCode;
  }
}

module.exports = UnauthorizedError;
