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

  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'Usuário já registrado' });
    }

    user = new User({ email, password });
    await user.save();

    // Enviar email de boas-vindas (opcional)
    await sendEmail({
      to: email,
      subject: 'Bem-vindo ao Pet Tech',
      text: `Sua conta foi criada com sucesso.`,
    });

    res.status(201).json({ message: 'Usuário registrado com sucesso.' });
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
