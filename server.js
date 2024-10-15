require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const app = express();

// Conectar ao MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('Conectado ao MongoDB'))
  .catch(err => console.error('Erro ao conectar ao MongoDB', err));

// Middlewares
app.use(cors({
  origin: 'https://pratoderacao-front.onrender.com', // Ou o domínio do seu frontend em produção
  credentials: true,  // Permitir cookies ou headers de autenticação
}));
app.use(express.json()); // Parse de JSON

// Rotas
app.use('/api/auth', authRoutes);

// Iniciar servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
