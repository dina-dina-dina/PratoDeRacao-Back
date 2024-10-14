// backend/server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');

const app = express();

// Middlewares
app.use(express.json());
app.use(cors({
  origin: 'https://pratoderacao-front.onrender.com', // URL do frontend hospedado no Render
  credentials: true,
}));
app.use(helmet());

// Limitação de taxa para prevenir ataques de força bruta
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // Limite cada IP a 100 requisições por janela
});
app.use(limiter);

// Rotas
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

// Servir imagens de pets
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Conexão com o MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('Conectado ao MongoDB');
  // Iniciar o servidor
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
})
.catch(err => {
  console.error('Erro ao conectar ao MongoDB:', err.message);
});
