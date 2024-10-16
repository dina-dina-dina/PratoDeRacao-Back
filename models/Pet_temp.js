const mongoose = require('mongoose');

const petSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  raca: { type: String, required: true },
  nascimento: { type: Date, required: true },
  peso: { type: Number, required: true },
  pesoRacao: { type: Number, required: true },
  tutorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tutor', required: true }, // Associa o Pet ao Tutor
}, { timestamps: true });

module.exports = mongoose.model('Pet', petSchema);
