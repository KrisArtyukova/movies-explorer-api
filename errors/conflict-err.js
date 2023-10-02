const {
  ConflictErrorCode,
} = require('./errorCodes');

class ConflictError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = ConflictErrorCode;
  }
}

module.exports = ConflictError;
