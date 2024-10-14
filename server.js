// backend/server.js
const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
require('dotenv').config(); // Carrega variáveis de ambiente

const app = express();
const PORT = process.env.PORT || 5000;

// Configuração do CORS
const corsOptions = {
  origin: 'https://pratoderacao-front.onrender.com', // Substitua pela URL do seu frontend no Render
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
app.use(express.json());

// Conectar ao MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('Conectado ao MongoDB');
})
.catch((err) => {
  console.error('Erro ao conectar ao MongoDB:', err);
});

// Definir esquema e modelo de usuário
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const User = mongoose.model('User', userSchema);

// Configuração do transporte de email
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Rota de exemplo para verificar o funcionamento
app.get('/', (req, res) => {
  res.send('API do Prato de Ração está funcionando!');
});

// Rota para registro
app.post('/register', async (req, res) => {
  const { email } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Usuário já registrado.' });
    }

    // Gera uma senha aleatória de 8 caracteres
    const randomPassword = crypto.randomBytes(4).toString('hex');

    // Hash da senha
    const hashedPassword = await bcrypt.hash(randomPassword, 10);

    // Cria e salva o novo usuário
    const newUser = new User({ email, password: hashedPassword });
    await newUser.save();

    // Envia o email com a senha
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Bem-vindo ao Pet Tech Tracker - Sua Senha',
      text: `Olá,\n\nSeu cadastro foi realizado com sucesso! Sua senha temporária é: ${randomPassword}\nPor favor, faça o login e altere sua senha.\n\nAtenciosamente,\nEquipe Pet Tech Tracker`,
    };

    await transporter.sendMail(mailOptions);
    res.json({ success: true, message: 'Cadastro realizado com sucesso! Verifique seu email para a senha.' });
  } catch (error) {
    console.error('Erro ao registrar usuário:', error);
    res.status(500).json({ success: false, message: 'Erro ao registrar usuário. Tente novamente mais tarde.' });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
