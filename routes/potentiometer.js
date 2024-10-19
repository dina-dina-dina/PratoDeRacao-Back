// routes/potentiometer.js
const express = require('express');
const router = express.Router();
const Potentiometer = require('../models/Potentiometer');
const { io } = require('../server'); // Importa o socket.io

// Endpoint para receber dados do ESP32
router.post('/', async (req, res) => {
  const { value } = req.body;

  if (value === undefined) {
    return res.status(400).json({ message: 'Valor do potenciômetro é obrigatório.' });
  }

  try {
    const potentiometer = new Potentiometer({ value });
    await potentiometer.save();

    // Emite o valor recebido para todos os clientes conectados
    io.emit('newPotentiometerValue', potentiometer);

    res.status(201).json({ message: 'Valor recebido e armazenado com sucesso.', potentiometer });
  } catch (error) {
    console.error('Erro ao salvar valor do potenciômetro:', error);
    res.status(500).json({ message: 'Erro interno do servidor.' });
  }
});

// Endpoint para obter dados históricos do potenciômetro
router.get('/historical', async (req, res) => {
  try {
    // Busca os 20 últimos registros, ordenados do mais antigo para o mais recente
    const potentiometerValues = await Potentiometer.find()
      .sort({ timestamp: -1 })
      .limit(20)
      .sort({ timestamp: 1 }); // Reordena para o mais antigo primeiro

    res.json({ potentiometerValues });
  } catch (error) {
    console.error('Erro ao buscar dados históricos do potenciômetro:', error);
    res.status(500).json({ message: 'Erro interno do servidor.' });
  }
});

module.exports = router;
