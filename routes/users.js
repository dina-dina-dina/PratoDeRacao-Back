// routes/users.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authenticate = require('../middlewares/authenticate');

// Obter informações do usuário
router.get('/me', authenticate, userController.getUserInfo);

// Atualizar informações do usuário
router.put('/me', authenticate, userController.updateUserInfo);

module.exports = router;
