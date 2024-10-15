const express = require('express');
const userController = require('../controllers/userController');
const authenticate = require('../middlewares/authenticate');
const upload = require('../middlewares/upload'); // Middleware de upload de arquivos
const router = express.Router();

// Rotas para obter e atualizar perfil
router.get('/me', authenticate, userController.getMyProfile);
router.put('/me/profile', authenticate, upload.single('photo'), userController.updateMyProfile);

module.exports = router;
