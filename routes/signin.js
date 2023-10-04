const router = require('express').Router();
const {
  login,
} = require('../controllers/users');
const { loginValidation } = require('../utils/validations');

router.post('/signin', loginValidation, login);

module.exports = router;
