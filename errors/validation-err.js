const {
  BadRequestErrorCode,
} = require('./errorCodes');
const { ValidationErrorName } = require('./errorNames');

class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = ValidationErrorName;
    this.statusCode = BadRequestErrorCode;
  }
}

module.exports = ValidationError;
