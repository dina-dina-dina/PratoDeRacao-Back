const crypto = require('crypto');
const nodemailer = require('../utils/sendEmail');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');

exports.register = async (req, res) => {
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

    // Gerar senha aleatória de 8 caracteres
    const randomPassword = crypto.randomBytes(4).toString('hex'); // 4 bytes = 8 caracteres hexadecimais

    // Criar novo usuário com a senha aleatória
    user = new User({
      email,
      password: randomPassword,  // A senha será criptografada pelo pre-save hook no modelo User
    });

    await user.save();

    // Enviar e-mail com a senha aleatória
    const message = `
      <h1>Bem-vindo à Prato de Ração!</h1>
      <p>Sua senha de acesso é: <strong>${randomPassword}</strong></p>
      <p>Por favor, faça login e altere sua senha assim que possível.</p>
    `;

    await nodemailer({
      to: email,
      subject: 'Cadastro na Prato de Ração',
      html: message,
    });

    res.status(201).json({ message: 'Usuário registrado com sucesso. Verifique seu e-mail para a senha.' });
  } catch (error) {
    res.status(500).json({ message: 'Erro no servidor', error: error.message });
  }
};
