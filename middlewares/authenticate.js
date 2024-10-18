// middlewares/authenticate.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authenticate = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Formato: "Bearer TOKEN"

  if (!token) {
    return res.status(401).json({ message: 'Acesso negado. Token ausente.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');
    if (!req.user) {
      return res.status(401).json({ message: 'Usuário não encontrado.' });
    }
    next();
  } catch (error) {
    return res.status(400).json({ message: 'Token inválido.' });
  }
};

module.exports = authenticate;
