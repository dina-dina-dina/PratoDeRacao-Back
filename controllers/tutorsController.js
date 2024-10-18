// controllers/tutorsController.js
const Tutor = require('../models/Tutor_temp');

// Exemplos de funções que podem ser adicionadas
const getTutorById = async (req, res) => {
  const { id } = req.params;
  try {
    const tutor = await Tutor.findById(id).populate('user', '-password');
    if (!tutor) {
      return res.status(404).json({ message: 'Tutor não encontrado.' });
    }
    res.json(tutor);
  } catch (error) {
    console.error('Erro ao obter tutor:', error);
    res.status(500).json({ message: 'Erro interno do servidor.' });
  }
};

// Outras funções de CRUD podem ser adicionadas conforme necessário

module.exports = { getTutorById };
