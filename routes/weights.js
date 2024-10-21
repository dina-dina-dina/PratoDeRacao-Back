// routes/weights.js
const express = require('express');
const router = express.Router();
const weightController = require('../controllers/weightController');

// Rota para verificar se a API está funcionando
router.get('/test', weightController.clientConnected);

// Rota para receber dados do ESP32
router.post('/', weightController.createWeightData);

// Rota para o frontend obter os dados da última semana
router.get('/recent', weightController.getRecentWeightData);

// Rota para o frontend obter o peso atual
router.get('/latest', weightController.getLatestWeightData);

module.exports = router;
