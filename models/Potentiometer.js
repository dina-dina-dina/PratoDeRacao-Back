// models/Potentiometer.js
const mongoose = require('mongoose');

const potentiometerSchema = new mongoose.Schema({
  value: { type: Number, required: true },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Potentiometer', potentiometerSchema);
