// backend/models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  username: { // Opcional, se desejar
    type: String,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: { // 'admin' ou 'user'
    type: String,
    enum: ['admin', 'user'],
    default: 'user',
  },
  pet: {
    name: { type: String },
    age: { type: Number },
    photo: { type: String }, // URL ou caminho da imagem
  },
}, { timestamps: true });

// Método para comparar senha
userSchema.methods.comparePassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};

// Middleware para hash de senha antes de salvar
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

module.exports = mongoose.model('User', userSchema);
