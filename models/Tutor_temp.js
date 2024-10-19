// models/Tutor.js
const mongoose = require('mongoose');

const tutorSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  nome: { type: String, required: true },
  telefone: { type: String, required: false }, // Campo agora opcional
}, { timestamps: true });

module.exports = mongoose.model('Tutor', tutorSchema);
