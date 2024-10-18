// models/Tutor_temp.js
const mongoose = require('mongoose');

const tutorSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true, // Assegura que cada usuário tenha apenas um tutor
  },
  nome: {
    type: String,
    required: true,
    trim: true,
  },
  telefone: {
    type: String,
    required: true,
    trim: true,
  },
  // Outros campos adicionais podem ser adicionados aqui
}, { timestamps: true });

module.exports = mongoose.model('Tutor', tutorSchema);
