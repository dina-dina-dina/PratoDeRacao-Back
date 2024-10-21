// models/WeightData.js
const mongoose = require('mongoose');

const WeightDataSchema = new mongoose.Schema({
  weights: {
    type: [Number], // Array com os pesos individuais dos sensores
    required: true,
  },
  totalWeight: {
    type: Number, // Peso total (soma dos sensores)
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
    expires: 604800, // Dados expiram após 1 semana
  },
});

module.exports = mongoose.model('WeightData', WeightDataSchema);
