const express = require('express');
const { body } = require('express-validator');
const authController = require('../controllers/authController');
const authenticate = require('../middlewares/authenticate');
const router = express.Router();

router.post('/register', [
  body('email').isEmail().withMessage('Email inválido'),
  body('password').isLength({ min: 6 }).withMessage('A senha deve ter pelo menos 6 caracteres'),
], authController.register);

router.post('/login', [
  body('email').isEmail().withMessage('Email inválido'),
  body('password').exists().withMessage('Senha é obrigatória'),
], authController.login);

router.post('/change-password', authenticate, [
  body('oldPassword').exists().withMessage('Senha antiga é obrigatória'),
  body('newPassword').isLength({ min: 6 }).withMessage('A nova senha deve ter pelo menos 6 caracteres'),
], authController.changePassword);

module.exports = router;
