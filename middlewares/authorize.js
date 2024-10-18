// middlewares/authorize.js
const authorize = (roles = []) => {
  // roles pode ser uma string ou array de strings
  if (typeof roles === 'string') {
    roles = [roles];
  }

  return (req, res, next) => {
    // Aqui você pode verificar o papel do usuário
    // Exemplo:
    // if (!roles.includes(req.user.role)) {
    //   return res.status(403).json({ message: 'Acesso negado' });
    // }
    next();
  };
};

module.exports = authorize;
