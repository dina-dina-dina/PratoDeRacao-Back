require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const petsRoutes = require('./routes/pets');
const tutorsRoutes = require('./routes/tutors');
const app = express();

const allowedOrigins = ['http://localhost:3000', 'https://pratoderacao-front.onrender.com'];


// Conectar ao MongoDB
mongoose.connect(process.env.MONGODB_URI, {
}).then(() => console.log('Conectado ao MongoDB'))
  .catch(err => console.error('Erro ao conectar ao MongoDB', err));

// Middlewares
const cors = require('cors');

app.use(cors({
  origin: 'https://pratoderacao-front.onrender.com', // Substitua pelo domínio do seu frontend em produção
  credentials: true,
}));


// Rotas
app.use('/api/auth', authRoutes);
app.use('/api/pets', petsRoutes);
app.use('/api/tutors', tutorsRoutes);

// Iniciar servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
