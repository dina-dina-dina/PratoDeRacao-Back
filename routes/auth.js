// routes/auth.js
const express = require('express');
const router = express.Router();
const { register, login, confirmEmail, changePassword } = require('../controllers/authController');
const authenticate = require('../middlewares/authenticate');

// Rota para registro
router.post('/register', register);

// Rota para login
router.post('/login', login);

// Rota para confirmação de email
router.get('/confirmar-email', confirmEmail);

// Rota para trocar a senha
router.post('/change-password', authenticate, changePassword);

module.exports = router;
