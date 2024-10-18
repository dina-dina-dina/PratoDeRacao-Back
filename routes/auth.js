// routes/auth.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Registro de usuário
router.post('/register', authController.register);

// Login de usuário
router.post('/login', authController.login);

// Troca de senha
router.post('/change-password', authController.changePassword);

module.exports = router;
