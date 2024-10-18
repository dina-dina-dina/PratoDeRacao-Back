// routes/tutors.js
const express = require('express');
const router = express.Router();
const tutorsController = require('../controllers/tutorsController');
const authenticate = require('../middlewares/authenticate');

// Obter informações do tutor
router.get('/me', authenticate, tutorsController.getTutorInfo);

// Atualizar informações do tutor
router.put('/me', authenticate, tutorsController.updateTutorInfo);

module.exports = router;
