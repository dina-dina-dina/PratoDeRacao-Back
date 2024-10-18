// routes/pets.js
const express = require('express');
const router = express.Router();
const authenticate = require('../middlewares/authenticate');
const { getPets, createPet, updatePet, deletePet } = require('../controllers/petsController');
const upload = require('../middlewares/upload');

// Rota para obter todos os pets do tutor
router.get('/', authenticate, getPets);

// Rota para criar um novo pet
router.post('/', authenticate, upload.single('imagem'), createPet);

// Rota para atualizar um pet existente
router.put('/:id', authenticate, upload.single('imagem'), updatePet);

// Rota para remover um pet
router.delete('/:id', authenticate, deletePet);

module.exports = router;
