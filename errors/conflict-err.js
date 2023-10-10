const {
  ConflictErrorCode,
} = require('./errorCodes');
const { ConflictErrorName } = require('./errorNames');

class ConflictError extends Error {
  constructor(message) {
    super(message);
    this.name = ConflictErrorName;
    this.statusCode = ConflictErrorCode;
  }
}

module.exports = ConflictError;
