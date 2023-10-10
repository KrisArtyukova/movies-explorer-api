const router = require('express').Router();
const {
  getMovies, deleteMovie, createMovie,
} = require('../controllers/movies');
const { createMovieValidation, deleteMovieValidation } = require('../utils/validations');

// возвращает все сохранённые текущим пользователем фильмы
router.get('/', getMovies);

// создаёт фильм
router.post('/', createMovieValidation, createMovie);

// удаляет сохранённый фильм по id
router.delete('/:movieId', deleteMovieValidation, deleteMovie);

module.exports = router;
