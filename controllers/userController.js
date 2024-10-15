const User = require('../models/User');
const { validationResult } = require('express-validator');

// Obter perfil do usuário
exports.getMyProfile = async (req, res) => {
  const userId = req.user.id;

  try {
    const user = await User.findById(userId).select('-password'); // Remover senha
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Erro no servidor', error: error.message });
  }
};

// Atualizar perfil do usuário (ex. informações do pet)
exports.updateMyProfile = async (req, res) => {
  const userId = req.user.id;
  const { pet } = req.body;
  const photo = req.file ? `/uploads/${req.file.filename}` : undefined;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    if (pet) {
      user.pet = {
        ...user.pet,
        ...pet,
      };
    }

    if (photo) {
      user.pet.photo = photo;
    }

    await user.save();

    res.json({ message: 'Perfil atualizado com sucesso', user });
  } catch (error) {
    res.status(500).json({ message: 'Erro no servidor', error: error.message });
  }
};
