// backend/routes/auth.js
const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const authController = require('../controllers/authController');

// Rota de registro
router.post('/register', [
  body('email').isEmail().withMessage('Email inválido'),
], authController.register);

// Rota de login
router.post('/login', [
  body('email').isEmail().withMessage('Email inválido'),
  body('password').exists().withMessage('Senha é obrigatória'),
], authController.login);

// Rota para trocar senha (necessita autenticação)
const authenticate = require('../middlewares/authenticate');
router.post('/change-password', authenticate, [
  body('oldPassword').exists().withMessage('Senha antiga é obrigatória'),
  body('newPassword').isLength({ min: 6 }).withMessage('A nova senha deve ter pelo menos 6 caracteres'),
], authController.changePassword);

module.exports = router;
