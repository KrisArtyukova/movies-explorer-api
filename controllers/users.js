const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { Created } = require('../errors/errorCodes');
const UnauthorizedError = require('../errors/unauthorized-err');
const InternalServerError = require('../errors/internal-server-err');
const { errorHandler } = require('../errors/errorHandler');
const {
  BadRequestErrorName,
  ConflictErrorName,
  ForbiddenErrorName,
  NotFoundErrorName,
  UnauthorizedErrorName,
  ValidationErrorName,
  CastErrorName,
  InternalServerErrorName,
} = require('../errors/errorNames');

const getUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => res.send({ data: user }))
    .catch((err) => errorHandler(err, res, {
      [BadRequestErrorName]: `Ошибочный запрос: ${err.message}`,
      [ConflictErrorName]: `Конфликт сервера: ${err.message}`,
      [ForbiddenErrorName]: `Запрещено: ${err.message}`,
      [NotFoundErrorName]: `Пользователь не найден: ${err.message}`,
      [UnauthorizedErrorName]: `Отсутствует авторизация: ${err.message}`,
      [ValidationErrorName]: `Неверные данные в запросе: ${Object.values(err.errors).map((e) => e.message).join(', ')}`,
      [CastErrorName]: `Ошибка в БД: ${err.message}`,
      [InternalServerErrorName]: `Произошла ошибка сервера при получении пользователя: ${err.message}`,
    }, next));
};

const createUser = (req, res, next) => {
  const {
    name, email, password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name,
      email,
      password: hash, // записываем хеш в базу
    }))
    .then((user) => {
      res.status(Created);
      res.send({ data: { name: user.name, email: user.email } });
    })
    .catch((err) => errorHandler(err, res, {
      [BadRequestErrorName]: `Ошибочный запрос: ${err.message}`,
      [ConflictErrorName]: `Такой email уже существует: ${err.message}`,
      [ForbiddenErrorName]: `Запрещено: ${err.message}`,
      [NotFoundErrorName]: `Пользователь не найден: ${err.message}`,
      [UnauthorizedErrorName]: `Отсутствует авторизация: ${err.message}`,
      [ValidationErrorName]: `Неверные данные в запросе: ${Object.values(err.errors).map((e) => e.message).join(', ')}`,
      [CastErrorName]: `Ошибка в БД: ${err.message}`,
      [InternalServerErrorName]: `Произошла ошибка сервера при создании пользователя: ${err.message}`,
    }, next));
};

const updateUser = (req, res, next) => {
  User.findByIdAndUpdate(req.user._id, {
    name: req.body.name, email: req.body.email,
  }, { new: true, runValidators: true })
    .then((user) => (res.send({ data: user })))
    .catch((err) => errorHandler(err, res, {
      [BadRequestErrorName]: `Ошибочный запрос: ${err.message}`,
      [ConflictErrorName]: `Такой email уже существует: ${err.message}`,
      [ForbiddenErrorName]: `Запрещено: ${err.message}`,
      [NotFoundErrorName]: `Пользователь не найден: ${err.message}`,
      [UnauthorizedErrorName]: `Отсутствует авторизация: ${err.message}`,
      [ValidationErrorName]: `Неверные данные в запросе: ${Object.values(err.errors).map((e) => e.message).join(', ')}`,
      [CastErrorName]: `Ошибка в БД: ${err.message}`,
      [InternalServerErrorName]: `Произошла ошибка сервера при создании пользователя: ${err.message}`,
    }, next));
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  User.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        next(new UnauthorizedError('Неправильные почта или пароль'));
      } else {
        return bcrypt.compare(password, user.password)
          .then((matched) => {
            if (!matched) {
              next(new UnauthorizedError('Неправильные почта или пароль'));
            } else {
              return user;
            }
            return new InternalServerError('Ошибка');
          });
      }
      return new InternalServerError('Ошибка');
    })
    .then((user) => {
      const { NODE_ENV, JWT_SECRET } = process.env;
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', { expiresIn: '10d' });

      res.send({ token });
    })
    .catch((err) => errorHandler(err, res, {
      [BadRequestErrorName]: `Ошибочный запрос: ${err.message}`,
      [ConflictErrorName]: `Конфликт БД: ${err.message}`,
      [ForbiddenErrorName]: `Запрещено: ${err.message}`,
      [NotFoundErrorName]: `Данные не найдены: ${err.message}`,
      [UnauthorizedErrorName]: `Отсутствует авторизация: ${err.message}`,
      [ValidationErrorName]: `Неверные данные в запросе: ${Object.values(err.errors).map((e) => e.message).join(', ')}`,
      [CastErrorName]: `Ошибка в БД: ${err.message}`,
      [InternalServerErrorName]: `Произошла ошибка сервера при создании пользователя: ${err.message}`,
    }, next));
};

module.exports = {
  createUser, updateUser, login, getUser,
};
