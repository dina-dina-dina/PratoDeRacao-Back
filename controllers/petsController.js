// controllers/petsController.js
const Pet = require('../models/Pet_temp');
const Tutor = require('../models/Tutor_temp');

// Obter todos os pets do tutor
const getPets = async (req, res) => {
  try {
    const tutor = await Tutor.findOne({ user: req.user._id });
    if (!tutor) {
      return res.status(404).json({ message: 'Perfil do tutor não encontrado.' });
    }

    const pets = await Pet.find({ tutor: tutor._id });
    res.json(pets);
  } catch (error) {
    console.error('Erro ao obter pets:', error);
    res.status(500).json({ message: 'Erro interno do servidor.' });
  }
};

// Criar um novo pet
const createPet = async (req, res) => {
  const { nome, raca, nascimento, peso, pesoRacao } = req.body;
  const imagem = req.file ? req.file.filename : 'default_pet.jpg';

  if (!nome || !raca || !nascimento || !peso || !pesoRacao) {
    return res.status(400).json({ message: 'Por favor, preencha todos os campos.' });
  }

  try {
    const tutor = await Tutor.findOne({ user: req.user._id });
    if (!tutor) {
      return res.status(404).json({ message: 'Perfil do tutor não encontrado.' });
    }

    const pet = new Pet({
      tutor: tutor._id,
      nome,
      raca,
      nascimento,
      peso,
      pesoRacao,
      imagem,
    });

    await pet.save();
    res.status(201).json({ message: 'Pet criado com sucesso!', pet });
  } catch (error) {
    console.error('Erro ao criar pet:', error);
    res.status(500).json({ message: 'Erro interno do servidor.' });
  }
};

// Atualizar um pet existente
const updatePet = async (req, res) => {
  const { id } = req.params;
  const { nome, raca, nascimento, peso, pesoRacao } = req.body;
  const imagem = req.file ? req.file.filename : undefined;

  try {
    const pet = await Pet.findById(id);
    if (!pet) {
      return res.status(404).json({ message: 'Pet não encontrado.' });
    }

    // Verificar se o pet pertence ao tutor
    const tutor = await Tutor.findOne({ user: req.user._id });
    if (!tutor || pet.tutor.toString() !== tutor._id.toString()) {
      return res.status(403).json({ message: 'Acesso proibido.' });
    }

    if (nome) pet.nome = nome;
    if (raca) pet.raca = raca;
    if (nascimento) pet.nascimento = nascimento;
    if (peso) pet.peso = peso;
    if (pesoRacao) pet.pesoRacao = pesoRacao;
    if (imagem) pet.imagem = imagem;

    await pet.save();
    res.json({ message: 'Pet atualizado com sucesso!', pet });
  } catch (error) {
    console.error('Erro ao atualizar pet:', error);
    res.status(500).json({ message: 'Erro interno do servidor.' });
  }
};

// Excluir um pet
const deletePet = async (req, res) => {
  const { id } = req.params;

  try {
    const pet = await Pet.findById(id);
    if (!pet) {
      return res.status(404).json({ message: 'Pet não encontrado.' });
    }

    // Verificar se o pet pertence ao tutor
    const tutor = await Tutor.findOne({ user: req.user._id });
    if (!tutor || pet.tutor.toString() !== tutor._id.toString()) {
      return res.status(403).json({ message: 'Acesso proibido.' });
    }

    await pet.remove();
    res.json({ message: 'Pet removido com sucesso.' });
  } catch (error) {
    console.error('Erro ao remover pet:', error);
    res.status(500).json({ message: 'Erro interno do servidor.' });
  }
};

module.exports = { getPets, createPet, updatePet, deletePet };
