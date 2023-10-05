const Movie = require('../models/movie');
const { errorHandler } = require('../errors/errorHandler');
const {
  Created,
} = require('../errors/errorCodes');
const ForbiddenError = require('../errors/forbidden-err');
const NotFoundError = require('../errors/not-found-err');
const {
  BadRequestErrorName, ConflictErrorName, ForbiddenErrorName,
  NotFoundErrorName, UnauthorizedErrorName,
  ValidationErrorName, CastErrorName, InternalServerErrorName,
} = require('../errors/errorNames');

const getMovies = (req, res, next) => {
  const owner = req.user._id;

  Movie.find({ owner })
    .populate(['owner'])
    .then((movie) => res.send({ data: movie }))
    .catch((err) => errorHandler(err, res, {
      [BadRequestErrorName]: `Ошибочный запрос: ${err.message}`,
      [ConflictErrorName]: `Конфликт сервера: ${err.message}`,
      [ForbiddenErrorName]: `Запрещено: ${err.message}`,
      [NotFoundErrorName]: `Фильмы не найдены: ${err.message}`,
      [UnauthorizedErrorName]: `Отсутствует авторизация: ${err.message}`,
      [ValidationErrorName]: `Неверные данные в запросе: ${Object.values(err.errors).map((e) => e.message).join(', ')}`,
      [CastErrorName]: `Ошибка в БД: ${err.message}`,
      [InternalServerErrorName]: `Произошла ошибка сервера при получении фильмов: ${err.message}`,
    }, next));
};

const deleteMovie = (req, res, next) => {
  const owner = req.user._id;
  const { movieId } = req.params;

  Movie.findById(movieId)
    .then((movie) => {
      if (!movie) {
        next(new NotFoundError('Фильм не найден'));
        return;
      }

      if (movie.owner.toString() !== owner) {
        next(new ForbiddenError('Фильм не найден'));
        return;
      }
      Movie.findByIdAndRemove(req.params.movieId)
        .then((removedMovie) => {
          res.status(200).send({ data: removedMovie });
        });
    })
    .catch((err) => errorHandler(err, res, {
      [BadRequestErrorName]: `Ошибочный запрос: ${err.message}`,
      [ConflictErrorName]: `Конфликт сервера: ${err.message}`,
      [ForbiddenErrorName]: `Запрещено: ${err.message}`,
      [NotFoundErrorName]: `Фильмы не найдены: ${err.message}`,
      [UnauthorizedErrorName]: `Отсутствует авторизация: ${err.message}`,
      [ValidationErrorName]: `Неверные данные в запросе: ${Object.values(err.errors).map((e) => e.message).join(', ')}`,
      [CastErrorName]: `Ошибка в БД: ${err.message}`,
      [InternalServerErrorName]: `Произошла ошибка при удалении фильма: ${err.message}`,
    }, next));
};

const createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
  } = req.body;
  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
    owner: req.user._id,
  })
    .then((movie) => {
      movie
        .populate('owner')
        .then(() => {
          res.status(Created);
          res.send({ data: movie });
        });
    })
    .catch((err) => {
      errorHandler(err, res, {
        [BadRequestErrorName]: `Ошибочный запрос: ${err.message}`,
        [ConflictErrorName]: `Конфликт сервера: ${err.message}`,
        [ForbiddenErrorName]: `Запрещено: ${err.message}`,
        [NotFoundErrorName]: `Фильм не найден: ${err.message}`,
        [UnauthorizedErrorName]: `Отсутствует авторизация: ${err.message}`,
        [ValidationErrorName]: `Неверные данные в запросе: ${Object.values(err.errors).map((e) => e.message).join(', ')}`,
        [CastErrorName]: `Ошибка в БД: ${err.message}`,
        [InternalServerErrorName]: `Произошла ошибка при создании фильма: ${err.message}`,
      }, next);
    });
};

module.exports = {
  getMovies, deleteMovie, createMovie,
};
