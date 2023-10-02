const router = require('express').Router();
const { updateUser, getUser, createUser } = require('../controllers/users');

// возвращает информацию о пользователе (email и имя)
router.get('/me', getUser);
// обновляет информацию о пользователе (email и имя)
router.patch('/me', updateUser);
// создание пользователя
router.post('/', createUser);

module.exports = router;
