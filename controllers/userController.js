// controllers/userController.js
const User = require('../models/User');
const Tutor = require('../models/Tutor');

// Obter informações do usuário
exports.getUserInfo = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }
    res.json(user);
  } catch(err) {
    console.error(err);
    res.status(500).json({ message: 'Erro no servidor' });
  }
};

// Atualizar informações do usuário
exports.updateUserInfo = async (req, res) => {
  const { email, password } = req.body;
  
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }
    
    if (email) user.email = email;
    if (password) user.password = password;
    
    await user.save();
    
    res.json({ message: 'Informações atualizadas com sucesso' });
  } catch(err) {
    console.error(err);
    res.status(500).json({ message: 'Erro no servidor' });
  }
};
