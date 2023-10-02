const Movie = require('../models/movie');
const { errorHandler } = require('../errors/errorHandler');
const {
  NotFound, NotFoundError, InternalServerError, Created,
} = require('../errors/errorCodes');
const { defaultErrorMessages } = require('../errors/errorHandler');

const getMovies = (req, res) => {
  Movie.find({})
    .populate(['owner'])
    .then((movie) => res.send({ data: movie }))
    .catch((err) => errorHandler(err, res, {
      ...defaultErrorMessages,
      [NotFoundError]: 'Фильмы не найдены',
      [InternalServerError]: 'Произошла ошибка при получении фильмов',
    }));
};

const deleteMovie = (req, res) => {
  Movie.findByIdAndRemove(req.params.movieId)
    .then((movie) => {
      if (!movie) {
        res.status(NotFound).send({ message: 'Фильм не найден' });
      } else {
        res.send({ data: movie });
      }
    })
    .catch((err) => errorHandler(err, res, {
      ...defaultErrorMessages,
      [NotFoundError]: 'Фильмы не найдены',
      [InternalServerError]: 'Произошла ошибка при удалении фильма',
    }));
};

const createMovie = (req, res) => {
  const { name, link } = req.body;
  Movie.create({ name, link, owner: req.user._id })
    .then((movie) => {
      movie
        .populate('owner')
        .then(() => {
          res.status(Created);
          res.send({ data: movie });
        });
    })
    .catch((err) => errorHandler(err, res, {
      ...defaultErrorMessages,
      [NotFoundError]: 'Не найдено',
      [InternalServerError]: 'Произошла ошибка при создании фильма',
    }));
};

module.exports = {
  getMovies, deleteMovie, createMovie,
};
