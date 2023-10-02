const {
  BadRequestErrorCode,
} = require('./errorCodes');

class BadRequestError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = BadRequestErrorCode;
  }
}

module.exports = BadRequestError;
