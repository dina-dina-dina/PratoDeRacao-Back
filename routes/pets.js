// routes/pets.js
const express = require('express');
const router = express.Router();
const petsController = require('../controllers/petsController');
const authenticate = require('../middlewares/authenticate');
const upload = require('../middlewares/upload');

// Obter todos os pets do tutor
router.get('/', authenticate, petsController.getPets);

// Obter um pet específico
router.get('/:id', authenticate, petsController.getPetById);

// Criar um novo pet (com upload de imagem opcional)
router.post('/', authenticate, upload.single('imagem'), petsController.createPet);

// Atualizar informações do pet
router.put('/:id', authenticate, upload.single('imagem'), petsController.updatePet);

// Deletar um pet
router.delete('/:id', authenticate, petsController.deletePet);

module.exports = router;
