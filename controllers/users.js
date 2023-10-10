const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { Created } = require('../errors/errorCodes');
const UnauthorizedError = require('../errors/unauthorized-err');
const {
  ValidationErrorName,
  CastErrorName,
} = require('../errors/errorNames');
const ConflictError = require('../errors/conflict-err');
const ValidationError = require('../errors/validation-err');
const CastError = require('../errors/cast-err');
const NotFoundError = require('../errors/not-found-err');

const getUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (user) {
        res.send({ data: user });
      } else {
        next(new NotFoundError('Пользователь не найден'));
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
    .catch((err) => {
      if (err.code === 11000) {
        next(new ConflictError(err.message));
      } else if (err.name === ValidationErrorName) {
        next(new ValidationError(`Неверные данные в запросе: ${Object.values(err.errors).map((e) => e.message).join(', ')}`));
      } else {
        next(err);
      }
    });
};

const updateUser = (req, res, next) => {
  User.findByIdAndUpdate(req.user._id, {
    name: req.body.name, email: req.body.email,
  }, { new: true, runValidators: true })
    .then((user) => {
      if (user) {
        res.send({ data: user });
      } else {
        next(new NotFoundError('Пользователь не найден'));
      }
    })
    .catch((err) => {
      if (err.code === 11000) {
        next(new ConflictError(err.message));
      } else if (err.name === CastErrorName) {
        next(new CastError(`Ошибка при запросе: ${err.message}`));
      } else if (err.name === ValidationErrorName) {
        next(new ValidationError(`Неверные данные в запросе: ${Object.values(err.errors).map((e) => e.message).join(', ')}`));
      } else {
        next(err);
      }
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  User.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        return next(new UnauthorizedError('Неправильные почта или пароль'));
      } else {
        return bcrypt.compare(password, user.password)
          .then((matched) => {
            if (!matched) {
              return next(new UnauthorizedError('Неправильные почта или пароль'));
            } else {
              return user;
            }
          });
      }
    })
    .then((user) => {
      const { NODE_ENV, JWT_SECRET } = process.env;
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', { expiresIn: '10d' });

      res.send({ token });
    })
    .catch((err) => {
      if (err.name === CastErrorName) {
        next(new CastError(`Ошибка при запросе: ${err.message}`));
      } else {
        next(err);
      }
    });
};

module.exports = {
  createUser, updateUser, login, getUser,
};
