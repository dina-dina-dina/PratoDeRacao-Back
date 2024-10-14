// backend/controllers/authController.js
const User = require('../models/User');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const sendEmail = require('../utils/sendEmail');
const crypto = require('crypto');

exports.register = async (req, res) => {
  // Validação
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  
  const { email } = req.body;

  try {
    // Verificar se o usuário já existe
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'Usuário já registrado' });
    }

    // Gerar senha aleatória
    const randomPassword = crypto.randomBytes(8).toString('hex');

    // Criar novo usuário
    user = new User({
      email,
      password: randomPassword,
    });

    await user.save();

    // Enviar email com a senha
    const message = `
      <h1>Bem-vindo à Pet Tech!</h1>
      <p>Sua senha de acesso é: <strong>${randomPassword}</strong></p>
      <p>Por favor, faça login e altere sua senha.</p>
    `;

    await sendEmail({
      to: email,
      subject: 'Cadastro na Pet Tech',
      html: message,
    });

    res.status(201).json({ message: 'Usuário registrado com sucesso. Verifique seu email para a senha.' });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Erro no servidor' });
  }
};

exports.login = async (req, res) => {
  // Validação
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  
  const { email, password } = req.body;

  try {
    // Verificar se o usuário existe
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Credenciais inválidas' });
    }

    // Comparar senhas
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Credenciais inválidas' });
    }

    // Gerar JWT
    const payload = {
      user: {
        id: user.id,
        role: user.role,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '1h' },
      (err, token) => {
        if (err) throw err;
        res.json({ token, message: 'Login bem-sucedido' });
      }
    );
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Erro no servidor' });
  }
};

exports.changePassword = async (req, res) => {
  // Validação
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  
  const { oldPassword, newPassword } = req.body;
  const userId = req.user.id;

  try {
    const user = await User.findById(userId);
    
    // Verificar senha antiga
    const isMatch = await user.comparePassword(oldPassword);
    if (!isMatch) {
      return res.status(400).json({ message: 'Senha antiga incorreta' });
    }

    // Atualizar senha
    user.password = newPassword;
    await user.save();

    res.json({ message: 'Senha atualizada com sucesso' });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Erro no servidor' });
  }
};
