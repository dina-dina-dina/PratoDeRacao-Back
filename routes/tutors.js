const express = require('express');
const router = express.Router();
const tutorsController = require('../controllers/tutorsController');

// Rota para criar um tutor
router.post('/', tutorsController.createTutor);

module.exports = router;
