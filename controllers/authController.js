// controllers/authController.js
const User = require('../models/User');
const Tutor = require('../models/Tutor_temp');
const jwt = require('jsonwebtoken');
const sendEmail = require('../utils/sendEmail');

const changePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword) {
    return res.status(400).json({ message: 'Por favor, forneça a senha atual e a nova senha.' });
  }

  try {
    // Obter o usuário a partir do token
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }

    // Verificar se a senha atual está correta
    const isMatch = await user.comparePassword(oldPassword);
    if (!isMatch) {
      return res.status(400).json({ message: 'Senha atual incorreta.' });
    }

    // Atualizar para a nova senha
    user.password = newPassword;
    await user.save();

    res.json({ message: 'Senha alterada com sucesso.' });
  } catch (error) {
    console.error('Erro ao trocar a senha:', error);
    res.status(500).json({ message: 'Erro interno do servidor.' });
  }
};


const register = async (req, res) => {
  const { email, password, nome, telefone } = req.body;

  if (!email || !password || !nome || !telefone) {
    return res.status(400).json({ message: 'Por favor, preencha todos os campos.' });
  }

  try {
    // Verificar se o usuário já existe
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'Usuário já registrado.' });
    }

    // Criar novo usuário
    user = new User({ email, password });
    await user.save();

    // Criar perfil de tutor
    const tutor = new Tutor({
      user: user._id,
      nome,
      telefone,
    });
    await tutor.save();

    // Gerar token de verificação (opcional)
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

    // Enviar email de confirmação
    const confirmLink = `http://localhost:3000/confirmar-email?token=${token}`;
    const html = `
      <h1>Bem-vindo ao Pet Tech Tracker!</h1>
      <p>Obrigado por se registrar. Por favor, clique no link abaixo para confirmar seu email:</p>
      <a href="${confirmLink}">Confirmar Email</a>
    `;
    await sendEmail(email, 'Confirme seu Email', html);

    res.status(201).json({ message: 'Usuário registrado com sucesso. Verifique seu email para confirmação.' });
  } catch (error) {
    console.error('Erro no registro:', error);
    res.status(500).json({ message: 'Erro interno do servidor.' });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Verificar se o usuário existe
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Credenciais inválidas.' });
    }

    // Verificar se o email está confirmado (opcional)
    if (!user.isVerified) {
      return res.status(401).json({ message: 'Por favor, confirme seu email antes de fazer login.' });
    }

    // Verificar a senha
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Credenciais inválidas.' });
    }

    // Gerar token JWT
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.json({ token });
  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({ message: 'Erro interno do servidor.' });
  }
};

// Função para confirmar email
const confirmEmail = async (req, res) => {
  const { token } = req.query;

  if (!token) {
    return res.status(400).json({ message: 'Token de confirmação ausente.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(400).json({ message: 'Usuário não encontrado.' });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: 'Email já confirmado.' });
    }

    user.isVerified = true;
    await user.save();

    res.json({ message: 'Email confirmado com sucesso!' });
  } catch (error) {
    console.error('Erro na confirmação de email:', error);
    res.status(400).json({ message: 'Token de confirmação inválido ou expirado.' });
  }
};

module.exports = { register, login, confirmEmail, changePassword };
