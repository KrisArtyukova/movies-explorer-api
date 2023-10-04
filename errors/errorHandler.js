const BadRequestError = require('./bad-request-err');
const NotFoundError = require('./not-found-err');
const InternalServerError = require('./internal-server-err');
const { BadRequestErrorCode } = require('./errorCodes');

const defaultErrorMessages = {
  [BadRequestErrorCode]: 'Некорректный id',
};

const errorHandler = (err, res, errorMessage, next) => {
  switch (err.name) {
    case BadRequestErrorCode:
      next(new BadRequestError(errorMessage[err.name]));
      return;
    case NotFoundError:
      next(new NotFoundError(errorMessage[err.name]));
      return;
    default:
      next(new InternalServerError(errorMessage[err.name]));
  }
};

module.exports = {
  errorHandler, defaultErrorMessages,
};
