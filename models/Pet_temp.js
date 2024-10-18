// models/Pet_temp.js
const mongoose = require('mongoose');

const petSchema = new mongoose.Schema({
  tutor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tutor',
    required: true,
  },
  nome: {
    type: String,
    required: true,
    trim: true,
  },
  raca: {
    type: String,
    required: true,
    trim: true,
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
  // Campo para armazenar a imagem do pet
  imagem: {
    type: String,
    default: 'default_pet.jpg',
  },
}, { timestamps: true });

module.exports = mongoose.model('Pet', petSchema);
