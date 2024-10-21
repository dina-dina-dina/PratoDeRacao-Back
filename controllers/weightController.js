// controllers/weightController.js
const WeightData = require('../models/WeightData');

// Função para registrar quando um cliente se conecta
exports.clientConnected = (req, res) => {
  console.log('Cliente conectado:', req.ip);
  res.send('API de Pesos está funcionando!');
};

exports.createWeightData = async (req, res) => {
  console.log('Requisição recebida de:', req.ip);
  console.log('Dados recebidos do ESP32:', req.body);

  try {
    const { weights, totalWeight } = req.body;

    if (!weights || !totalWeight) {
      console.log('Dados inválidos recebidos');
      return res.status(400).json({ message: 'Dados inválidos' });
    }

    const newData = new WeightData({ weights, totalWeight });
    await newData.save();

    console.log('Dados de peso salvos com sucesso:', newData);
    res.status(201).json({ message: 'Dados de peso salvos com sucesso' });
  } catch (error) {
    console.error('Erro ao salvar os dados de peso:', error);
    res.status(500).json({ message: 'Erro ao salvar os dados de peso', error });
  }
};

exports.getRecentWeightData = async (req, res) => {
  console.log('Requisição para obter dados recentes de:', req.ip);

  try {
    // Obter dados da última semana
    const data = await WeightData.find({
      timestamp: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
    }).sort({ timestamp: 1 });

    console.log('Dados recentes retornados:', data);
    res.json(data);
  } catch (error) {
    console.error('Erro ao obter os dados de peso:', error);
    res.status(500).json({ message: 'Erro ao obter os dados de peso', error });
  }
};

exports.getLatestWeightData = async (req, res) => {
  console.log('Requisição para obter o último dado de peso de:', req.ip);

  try {
    // Obter o último registro
    const data = await WeightData.findOne().sort({ timestamp: -1 });

    console.log('Último dado de peso retornado:', data);
    res.json(data);
  } catch (error) {
    console.error('Erro ao obter o último dado de peso:', error);
    res.status(500).json({ message: 'Erro ao obter o último dado de peso', error });
  }
};
