const express = require('express');
const router = express.Router();
const Tutor = require('../models/Tutor_temp');

// Rota para buscar o perfil do tutor logado
router.get('/me', async (req, res) => {
  try {
    const { email } = req.user; // Email vindo do token ou localStorage

    const tutor = await Tutor.findOne({ email }).populate('pets'); // Carregar os pets do tutor
    if (!tutor) {
      return res.status(404).json({ message: 'Tutor não encontrado' });
    }

    res.json(tutor);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar perfil', error: error.message });
  }
});

module.exports = router;
