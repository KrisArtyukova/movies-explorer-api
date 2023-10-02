const {
  NotFoundErrorCode,
} = require('./errorCodes');

class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = NotFoundErrorCode;
  }
}

module.exports = NotFoundError;
