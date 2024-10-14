// backend/controllers/userController.js
const User = require('../models/User');
const { validationResult } = require('express-validator');

exports.createUser = async (req, res) => {
  // Validação
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  
  const { email, password, role } = req.body;

  try {
    // Verificar se o usuário já existe
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'Usuário já existe' });
    }

    // Criar novo usuário
    user = new User({
      email,
      password,
      role: role || 'user',
    });

    await user.save();

    res.status(201).json({ message: 'Usuário criado com sucesso', user });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Erro no servidor' });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password'); // Excluir senha
    res.json(users);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Erro no servidor' });
  }
};

exports.updateUser = async (req, res) => {
  // Validação
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, role } = req.body;
  const userId = req.params.id;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    if (email) user.email = email;
    if (role) user.role = role;

    await user.save();

    res.json({ message: 'Usuário atualizado com sucesso', user });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Erro no servidor' });
  }
};

exports.deleteUser = async (req, res) => {
  const userId = req.params.id;

  try {
    await User.findByIdAndDelete(userId);
    res.json({ message: 'Usuário deletado com sucesso' });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Erro no servidor' });
  }
};

exports.updateUserProfile = async (req, res) => {
  const userId = req.params.id;
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
    console.error(error.message);
    res.status(500).json({ message: 'Erro no servidor' });
  }
};

// backend/controllers/userController.js

// ... métodos anteriores ...

exports.getMyProfile = async (req, res) => {
    const userId = req.user.id;
  
    try {
      const user = await User.findById(userId).select('-password');
      if (!user) {
        return res.status(404).json({ message: 'Usuário não encontrado' });
      }
      res.json(user);
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ message: 'Erro no servidor' });
    }
  };
  
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
      console.error(error.message);
      res.status(500).json({ message: 'Erro no servidor' });
    }
  };
  