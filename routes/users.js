// routes/users.js
const express = require('express');
const router = express.Router();
const authenticate = require('../middlewares/authenticate');
const { getUserProfile, updateUserProfile, deleteUserAndData } = require('../controllers/userController');


// Rota para obter perfil do usuário
router.get('/me', authenticate, getUserProfile);

// Rota para atualizar perfil do usuário
router.put('/me', authenticate, updateUserProfile);

// Rota para excluir o usuário e dados associados
router.delete('/me', authenticate, deleteUserAndData);



module.exports = router;
