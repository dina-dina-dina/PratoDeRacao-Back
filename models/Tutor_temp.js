const mongoose = require('mongoose');

const tutorSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  email: { type: String, required: true, unique: true }, // Cada email é único
  telefone: { type: String, required: true },
  pets: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Pet' }] // Lista de pets associados
}, { timestamps: true });

module.exports = mongoose.model('Tutor', tutorSchema);
