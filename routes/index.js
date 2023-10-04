const express = require('express');
const users = require('./users');
const movies = require('./movies');
const signin = require('./signin');
const signup = require('./signup');
const auth = require('../middlewares/auth');

const router = express.Router();

router
  .use('/', signin)
  .use('/', signup)
  .use('/users', auth, users)
  .use('/movies', auth, movies)
  .use('*', (req, res) => res.status(404).send({ message: 'Не найдено' }));

module.exports = router;
