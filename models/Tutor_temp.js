// models/Tutor.js
const mongoose = require('mongoose');

const TutorSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true,
    unique: true,
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
}, { timestamps: true });

module.exports = mongoose.model('Tutor', TutorSchema);
