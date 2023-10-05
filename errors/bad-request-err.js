const {
  BadRequestErrorCode,
} = require('./errorCodes');
const { BadRequestErrorName } = require('./errorNames');

class BadRequestError extends Error {
  constructor(message) {
    super(message);
    this.name = BadRequestErrorName;
    this.statusCode = BadRequestErrorCode;
  }
}

module.exports = BadRequestError;
