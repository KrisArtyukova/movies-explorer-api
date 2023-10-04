const router = require('express').Router();
const { updateUser, getUser, createUser } = require('../controllers/users');
const { createUserValidation, updateUserValidation } = require('../utils/validations');

// возвращает информацию о пользователе (email и имя)
router.get('/me', getUser);

// обновляет информацию о пользователе (email и имя)
router.patch('/me', updateUserValidation, updateUser);

// создание пользователя
router.post('/', createUserValidation, createUser);

module.exports = router;
