// backend/controllers/authController.js
const User = require('../models/User');
const { validationResult } = require('express-validator');
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
    console.error('Erro no registro:', error);
    res.status(500).json({ message: 'Erro no servidor durante o registro.', error: error.message });
  }
};
