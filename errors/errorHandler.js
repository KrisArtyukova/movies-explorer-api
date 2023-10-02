const {
  BadRequest, CastError, InternalServerError, NotFound, ValidationError, NotFoundError,
} = require('./errorCodes');

const defaultErrorMessages = {
  [CastError]: 'Некорректный id',
  [ValidationError]: 'Переданы некорректные данные',
};

const errorHandler = (err, res, errorMessage) => {
  switch (err.name) {
    case CastError:
      res.status(BadRequest).send({ message: errorMessage[CastError] });
      return;
    case ValidationError:
      res.status(BadRequest).send({ message: errorMessage[ValidationError] });
      return;
    case NotFoundError:
      res.status(NotFound).send({ message: errorMessage[NotFoundError] });
      return;
    default:
      res.status(InternalServerError).send({ message: errorMessage[InternalServerError] });
  }
};

module.exports = {
  errorHandler, defaultErrorMessages,
};
