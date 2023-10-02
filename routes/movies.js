const router = require('express').Router();
const {
  getMovies, deleteMovie, createMovie,
} = require('../controllers/movies');

// возвращает все сохранённые текущим пользователем фильмы
router.get('/', getMovies);
// создаёт фильм
router.post('/', createMovie);
// удаляет сохранённый фильм по id
router.delete('/:movieId', deleteMovie);

module.exports = router;
