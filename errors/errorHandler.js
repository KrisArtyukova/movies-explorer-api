const {
  BadRequestErrorName, NotFoundErrorName, ConflictErrorName, ForbiddenErrorName,
  UnauthorizedErrorName, ValidationErrorName, CastErrorName,
} = require('./errorNames');
const BadRequestError = require('./bad-request-err');
const NotFoundError = require('./not-found-err');
const InternalServerError = require('./internal-server-err');
const ConflictError = require('./conflict-err');
const ForbiddenError = require('./forbidden-err');
const UnauthorizedError = require('./unauthorized-err');
const ValidationError = require('./validation-err');
const CastError = require('./cast-err');

const errorHandler = (err, res, errorMessage, next) => {
  if (err.code === 11000) {
    next(new ConflictError('Такой email уже существует'));
    return;
  }

  switch (err.name) {
    case BadRequestErrorName:
      next(new BadRequestError(errorMessage[err.name]));
      return;
    case ConflictErrorName:
      next(new ConflictError(errorMessage[err.name]));
      return;
    case ForbiddenErrorName:
      next(new ForbiddenError(errorMessage[err.name]));
      return;
    case NotFoundErrorName:
      next(new NotFoundError(errorMessage[err.name]));
      return;
    case UnauthorizedErrorName:
      next(new UnauthorizedError(errorMessage[err.name]));
      return;
    case ValidationErrorName:
      next(new ValidationError(errorMessage[err.name]));
      return;
    case CastErrorName:
      next(new CastError(errorMessage[err.name]));
      return;
    default:
      next(new InternalServerError(errorMessage[err.name]));
  }
};

module.exports = {
  errorHandler,
};
