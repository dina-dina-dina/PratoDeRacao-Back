// backend/routes/users.js
const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const userController = require('../controllers/userController');
const authenticate = require('../middlewares/authenticate');
const authorize = require('../middlewares/authorize');
const upload = require('../middlewares/upload');

// Rotas para Admin
router.use('/admin', authenticate, authorize('admin'), express.Router()
  .post('/', [
    body('email').isEmail().withMessage('Email inválido'),
    body('password').isLength({ min: 6 }).withMessage('Senha deve ter pelo menos 6 caracteres'),
    body('role').optional().isIn(['admin', 'user']).withMessage('Role inválida'),
  ], userController.createUser)
  .get('/', userController.getAllUsers)
  .put('/:id', [
    body('email').optional().isEmail().withMessage('Email inválido'),
    body('role').optional().isIn(['admin', 'user']).withMessage('Role inválida'),
  ], userController.updateUser)
  .delete('/:id', userController.deleteUser)
  .put('/:id/profile', upload.single('photo'), userController.updateUserProfile)
);

// Rotas para Usuários
router.use('/', authenticate, express.Router()
  .get('/me', userController.getMyProfile)
  .put('/me/profile', upload.single('photo'), userController.updateMyProfile)
);

module.exports = router;
