const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const ConflictError = require('../errors/conflict-err');
const { Created } = require('../errors/errorCodes');
const UnauthorizedError = require('../errors/unauthorized-err');
const BadRequestError = require('../errors/bad-request-err');

const getUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => res.send({ data: user }))
    .catch(next);
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
    .catch((error) => {
      if (error.code === 11000) {
        next(new ConflictError('Такой email уже существует'));
      } else if (error.name === 'ValidationError') {
        next(new BadRequestError(`${Object.values(error.errors).map((e) => e.message).join(', ')}`));
      }
      next(error);
    });
};

const updateUser = (req, res, next) => {
  User.findByIdAndUpdate(req.user._id, {
    name: req.body.name, email: req.body.email,
  }, { new: true, runValidators: true })
    .then((user) => (res.send({ data: user })))
    .catch((error) => {
      if (error.code === 11000) {
        next(new ConflictError('Данный e-mail уже используется'));
      } else if (error.name === 'ValidationError') {
        next(new BadRequestError(`${Object.values(error.errors).map((e) => e.message).join(', ')}`));
      }
      next(error);
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  User.findOne({ email })
    .select('+password')
    // eslint-disable-next-line consistent-return
    .then((user) => {
      if (!user) {
        next(new UnauthorizedError('Неправильные почта или пароль'));
      } else {
        return bcrypt.compare(password, user.password)
          // eslint-disable-next-line consistent-return
          .then((matched) => {
            if (!matched) {
              next(new UnauthorizedError('Неправильные почта или пароль'));
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
    .catch(next);
};

module.exports = {
  createUser, updateUser, login, getUser,
};
