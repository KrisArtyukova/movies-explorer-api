const router = require('express').Router();
const {
  createUser,
} = require('../controllers/users');
const { createUserValidation } = require('../utils/validations');

router.post('/signup', createUserValidation, createUser);

module.exports = router;
