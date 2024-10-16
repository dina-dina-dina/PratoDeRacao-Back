const mongoose = require('mongoose');

const TutorSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  telefone: {
    type: String,
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('Tutor', TutorSchema);
