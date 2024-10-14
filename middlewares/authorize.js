// backend/middlewares/authorize.js
const authorize = (role) => {
    return (req, res, next) => {
      if (req.user.role !== role) {
        return res.status(403).json({ message: 'Acesso negado' });
      }
      next();
    };
  };
  
  module.exports = authorize;
  