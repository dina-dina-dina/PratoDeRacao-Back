// routes/tutors.js
const express = require('express');
const router = express.Router();
const authenticate = require('../middlewares/authenticate');
const { getTutorById } = require('../controllers/tutorsController');

// Rota para obter tutor por ID
router.get('/:id', authenticate, getTutorById);

// Outras rotas de CRUD podem ser adicionadas conforme necessário

module.exports = router;
