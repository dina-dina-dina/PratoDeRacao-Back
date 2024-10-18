// controllers/tutorsController.js
const Tutor = require('../models/Tutor');
const User = require('../models/User');

// Obter informações do tutor
exports.getTutorInfo = async (req, res) => {
  try {
    const tutor = await Tutor.findOne({ user: req.user._id }).populate('user', 'email');
    if (!tutor) {
      return res.status(404).json({ message: 'Tutor não encontrado' });
    }
    res.json(tutor);
  } catch(err) {
    console.error(err);
    res.status(500).json({ message: 'Erro no servidor' });
  }
};

// Atualizar informações do tutor
exports.updateTutorInfo = async (req, res) => {
  const { nome, telefone } = req.body;
  
  try {
    const tutor = await Tutor.findOne({ user: req.user._id });
    if (!tutor) {
      return res.status(404).json({ message: 'Tutor não encontrado' });
    }
    
    if (nome) tutor.nome = nome;
    if (telefone) tutor.telefone = telefone;
    
    await tutor.save();
    
    res.json({ message: 'Informações do tutor atualizadas com sucesso' });
  } catch(err) {
    console.error(err);
    res.status(500).json({ message: 'Erro no servidor' });
  }
};
