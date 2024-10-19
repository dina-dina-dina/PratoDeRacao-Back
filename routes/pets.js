// routes/pets.js
const express = require('express');
const router = express.Router();
const authenticate = require('../middlewares/authenticate');
const { createPet, updatePet, deletePet } = require('../controllers/petsController');
const multer = require('multer');
const path = require('path');

// Configuração do Multer para upload de imagens
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'uploads/'); // Pasta para armazenar as imagens
  },
  filename: function(req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Rotas protegidas
router.post('/', authenticate, upload.single('imagem'), createPet);
router.put('/:id', authenticate, upload.single('imagem'), updatePet);
router.delete('/:id', authenticate, deletePet);

module.exports = router;
