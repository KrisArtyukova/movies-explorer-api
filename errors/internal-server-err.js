const {
  InternalServerErrorCode,
} = require('./errorCodes');

class InternalServerError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = InternalServerErrorCode;
  }
}

module.exports = InternalServerError;
