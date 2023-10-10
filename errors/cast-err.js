const {
  InternalServerErrorCode,
} = require('./errorCodes');
const { CastErrorName } = require('./errorNames');

class CastError extends Error {
  constructor(message) {
    super(message);
    this.name = CastErrorName;
    this.statusCode = InternalServerErrorCode;
  }
}

module.exports = CastError;
