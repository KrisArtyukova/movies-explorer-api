const NotFoundError = require('../../errors/not-found-err');

const notFound = (req, res, next) => {
  next(new NotFoundError('Не найдено'));
};

module.exports = { notFound };
