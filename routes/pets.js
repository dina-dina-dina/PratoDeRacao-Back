const express = require('express');
const router = express.Router();
const petsController = require('./controllers/petsController');

// Rota para criar um pet
router.post('/', petsController.createPet);

module.exports = router;
