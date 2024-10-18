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
    trim: true,
  },
  telefone: {
    type: String,
    trim: true,
  },
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

// Virtual para pets
TutorSchema.virtual('pets', {
  ref: 'Pet',
  localField: '_id',
  foreignField: 'tutor',
});

module.exports = mongoose.model('Tutor', TutorSchema);
