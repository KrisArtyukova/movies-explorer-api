const {
  InternalServerErrorCode,
} = require('./errorCodes');
const { InternalServerErrorName } = require('./errorNames');

class InternalServerError extends Error {
  constructor(message) {
    super(message);
    this.name = InternalServerErrorName;
    this.statusCode = InternalServerErrorCode;
  }
}

module.exports = InternalServerError;
