const Movie = require('../models/movie');
const {
  Created,
} = require('../errors/errorCodes');
const ForbiddenError = require('../errors/forbidden-err');
const NotFoundError = require('../errors/not-found-err');
const {
  ValidationErrorName, CastErrorName,
} = require('../errors/errorNames');
const CastError = require('../errors/cast-err');
const ValidationError = require('../errors/validation-err');
const ConflictError = require('../errors/conflict-err');

const getMovies = (req, res, next) => {
  const owner = req.user._id;

  Movie.find({ owner })
    .populate(['owner'])
    .then((movie) => {
      if (movie) {
        res.send({ data: movie });
      } else {
        next(new NotFoundError('Фильмы не найдены'));
      }
    })
    .catch((err) => {
      if (err.name === CastErrorName) {
        next(new CastError(`Ошибка при запросе: ${err.message}`));
      } else {
        next(err);
      }
    });
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
    .catch((err) => next(err));
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
      if (err.name === ValidationErrorName) {
        next(new ValidationError(`Неверные данные в запросе: ${Object.values(err.errors).map((e) => e.message).join(', ')}`));
      } else if (err.code === 11000) {
        next(new ConflictError(err.message));
      } else {
        next(err);
      }
    });
};

module.exports = {
  getMovies, deleteMovie, createMovie,
};
