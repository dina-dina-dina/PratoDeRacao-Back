// middlewares/authorize.js
const authorize = (roles = []) => {
  // roles pode ser uma string ou um array de strings
  if (typeof roles === 'string') {
    roles = [roles];
  }

  return [
    (req, res, next) => {
      if (!roles.length || roles.includes(req.user.role)) {
        return next();
      }
      return res.status(403).json({ message: 'Acesso proibido.' });
    }
  ];
};

module.exports = authorize;
