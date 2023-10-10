const {
  NotFoundErrorCode,
} = require('./errorCodes');
const { NotFoundErrorName } = require('./errorNames');

class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = NotFoundErrorName;
    this.statusCode = NotFoundErrorCode;
  }
}

module.exports = NotFoundError;
