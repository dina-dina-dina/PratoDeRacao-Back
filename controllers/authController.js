const crypto = require('crypto'); // Adicione este módulo para gerar senhas aleatórias
const User = require('../models/User');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const sendEmail = require('../utils/sendEmail');
const bcrypt = require('bcryptjs');

exports.register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email } = req.body; // Agora só precisamos do email

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'Usuário já registrado' });
    }

    // Gerar senha aleatória de 12 caracteres
    const randomPassword = crypto.randomBytes(6).toString('hex'); // Gera uma senha aleatória

    // Criar novo usuário com a senha gerada
    user = new User({
      email,
      password: randomPassword // A senha será criptografada no pre-save hook do modelo User
    });

    await user.save();

    // Enviar email ao usuário com a senha gerada
    const message = `
      <h1>Bem-vindo ao Prato de Ração!</h1>
      <p>Sua conta foi criada com sucesso. Sua senha de acesso é: <strong>${randomPassword}</strong></p>
      <p>Por favor, faça login e altere sua senha assim que possível.</p>
    `;

    await sendEmail({
      to: email,
      subject: 'Bem-vindo ao Prato de Ração',
      text: `Sua conta foi criada com sucesso. Sua senha de acesso é: ${randomPassword}`,  // Texto simples
      html: message  // Conteúdo em HTML
    });

    res.status(201).json({ message: 'Usuário registrado com sucesso. Verifique seu e-mail para a senha.' });
  } catch (error) {
    res.status(500).json({ message: 'Erro no servidor', error: error.message });
  }
};


exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Credenciais inválidas' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Credenciais inválidas' });
    }

    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res.json({ token, message: 'Login bem-sucedido' });
  } catch (error) {
    res.status(500).json({ message: 'Erro no servidor', error: error.message });
  }
};

exports.changePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const userId = req.user.id;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    const isMatch = await user.comparePassword(oldPassword);
    if (!isMatch) {
      return res.status(400).json({ message: 'Senha antiga incorreta' });
    }

    user.password = newPassword;
    await user.save();

    res.json({ message: 'Senha atualizada com sucesso' });
  } catch (error) {
    res.status(500).json({ message: 'Erro no servidor', error: error.message });
  }
};
