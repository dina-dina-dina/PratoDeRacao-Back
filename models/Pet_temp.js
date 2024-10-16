const mongoose = require('mongoose');

const PetSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: true,
  },
  raca: {
    type: String,
    required: true,
  },
  nascimento: {
    type: Date,
    required: true,
  },
  peso: {
    type: Number,
    required: true,
  },
  pesoRacao: {
    type: Number,
    required: true,
  },
  tutor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tutor',
  },
}, { timestamps: true });

module.exports = mongoose.model('Pet', PetSchema);
