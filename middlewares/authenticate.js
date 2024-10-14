// backend/middlewares/authenticate.js
const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
  // Obter token do cabeçalho
  const token = req.header('Authorization')?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Sem token, autorização negada' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token inválido' });
  }
};

module.exports = authenticate;
