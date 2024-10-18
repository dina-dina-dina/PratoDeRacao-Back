// controllers/authController.js
const User = require('../models/User');
const Tutor = require('../models/Tutor');
const Pet = require('../models/Pet'); // Certifique-se de que o caminho está correto
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

// Função para gerar JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// Registro de novo usuário
exports.register = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Verifica se o usuário já existe
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'Usuário já existe' });
    }

    // Cria novo usuário
    user = new User({ email, password });
    await user.save();

    // Cria perfil de tutor associado ao usuário
    const tutor = new Tutor({ user: user._id, nome: 'Tutor Genérico', telefone: '(00) 00000-0000' });
    await tutor.save();

    // Cria um Pet genérico associado ao tutor
    const pet = new Pet({
      tutor: tutor._id,
      nome: 'Pet Genérico',
      raca: 'Raça Genérica',
      nascimento: new Date('2020-01-01'),
      peso: 10,
      pesoRacao: 5,
      imagem: 'uploads/default_pet.jpg', // Certifique-se de que esta imagem existe
    });
    await pet.save();

    res.status(201).json({ message: 'Usuário registrado com sucesso' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro no servidor' });
  }
};

// Login de usuário
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Verifica se o usuário existe
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Credenciais inválidas' });
    }

    // Verifica a senha
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Credenciais inválidas' });
    }

    // Gera token
    const token = generateToken(user._id);

    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro no servidor' });
  }
};

// Troca de senha
exports.changePassword = async (req, res) => {
  const { email, oldPassword, newPassword } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Usuário não encontrado' });
    }

    // Verifica a senha atual
    const isMatch = await user.comparePassword(oldPassword);
    if (!isMatch) {
      return res.status(400).json({ message: 'Senha atual incorreta' });
    }

    // Atualiza a senha
    user.password = newPassword;
    await user.save();

    res.json({ message: 'Senha atualizada com sucesso' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro no servidor' });
  }
};
