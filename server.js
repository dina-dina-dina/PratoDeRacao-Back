// server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const { Server } = require("socket.io");

// Importando rotas
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const petRoutes = require('./routes/pets');
const potentiometerRoutes = require('./routes/potentiometer'); // Nova rota

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Substitua pelo domínio do seu frontend
    methods: ["GET", "POST"]
  }
});

// Middlewares
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads')); // Serve arquivos estáticos

// Rotas
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/pets', petRoutes);
app.use('/api/potentiometer', potentiometerRoutes); // Adiciona a nova rota

// Conexão com o MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Conectado ao MongoDB');
  // Iniciar o servidor após a conexão bem-sucedida
  const PORT = process.env.PORT || 5000;
  server.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
  });
}).catch((error) => {
  console.error('Erro ao conectar ao MongoDB:', error);
});

// Socket.io para comunicação em tempo real
io.on('connection', (socket) => {
  console.log('Um usuário conectado');
  
  socket.on('disconnect', () => {
    console.log('Usuário desconectado');
  });
});

module.exports = { io };
