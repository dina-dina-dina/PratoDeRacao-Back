// controllers/userController.js
const User = require('../models/User');
const Tutor = require('../models/Tutor_temp');
const Pet = require('../models/Pet_temp'); // Importe o modelo de Pet

const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    const tutor = await Tutor.findOne({ user: req.user._id });

    if (!tutor) {
      return res.status(404).json({ message: 'Perfil do tutor não encontrado.' });
    }

    // Buscar os pets associados ao tutor
    const pets = await Pet.find({ tutor: tutor._id });

    res.json({ user, tutor, pets }); // Inclua os pets na resposta
  } catch (error) {
    console.error('Erro ao obter perfil do usuário:', error);
    res.status(500).json({ message: 'Erro interno do servidor.' });
  }
};

const updateUserProfile = async (req, res) => {
  const { nome, telefone } = req.body;

  try {
    const tutor = await Tutor.findOne({ user: req.user._id });

    if (!tutor) {
      return res.status(404).json({ message: 'Perfil do tutor não encontrado.' });
    }

    if (nome) tutor.nome = nome;
    if (telefone) tutor.telefone = telefone;

    await tutor.save();

    res.json({ message: 'Perfil atualizado com sucesso.', tutor });
  } catch (error) {
    console.error('Erro ao atualizar perfil do usuário:', error);
    res.status(500).json({ message: 'Erro interno do servidor.' });
  }
};

module.exports = { getUserProfile, updateUserProfile };
