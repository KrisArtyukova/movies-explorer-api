const Movie = require('../models/movie');
const { defaultErrorMessages, errorHandler } = require('../errors/errorHandler');
const BadRequestError = require('../errors/bad-request-err');
const {
  NotFoundErrorCode, InternalServerErrorCode, Created,
} = require('../errors/errorCodes');
const ForbiddenError = require('../errors/forbidden-err');
const NotFoundError = require('../errors/not-found-err');

const getMovies = (req, res) => {
  const owner = req.user._id;

  Movie.find({ owner })
    .populate(['owner'])
    .then((movie) => res.send({ data: movie }))
    .catch((err) => errorHandler(err, res, {
      ...defaultErrorMessages,
      [NotFoundErrorCode]: 'Фильмы не найдены',
      [InternalServerErrorCode]: 'Произошла ошибка при получении фильмов',
    }));
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

      if (movie.owner !== owner) {
        next(new ForbiddenError('Фильм не найден'));
        return;
      }
      Movie.findByIdAndRemove(req.params.movieId)
        .then((removedMovie) => {
          res.status(200).send({ data: removedMovie });
        });
    })
    .catch((err) => errorHandler(err, res, {
      ...defaultErrorMessages,
      [NotFoundErrorCode]: 'Фильмы не найдены',
      [InternalServerErrorCode]: 'Произошла ошибка при удалении фильма',
    }));
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
    .catch((error) => {
      if (error.name === 'ValidationError') {
        next(new BadRequestError(`${Object.values(error.errors).map((e) => e.message).join(', ')}`));
      } else {
        errorHandler(error, res, {
          ...defaultErrorMessages,
          [NotFoundErrorCode]: 'Не найдено',
          [InternalServerErrorCode]: 'Произошла ошибка при создании фильма',
        });
      }
    });
};

module.exports = {
  getMovies, deleteMovie, createMovie,
};
