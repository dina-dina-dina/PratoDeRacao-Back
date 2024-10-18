// middlewares/upload.js
const multer = require('multer');
const path = require('path');

// Configuração do armazenamento
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'uploads/'); // Pasta onde os arquivos serão armazenados
  },
  filename: function(req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Renomeia o arquivo para evitar conflitos
  }
});

// Filtro de arquivos
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);
  
  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error('Somente imagens (jpeg, jpg, png) são permitidas.'));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // Limite de 5MB
});

module.exports = upload;
