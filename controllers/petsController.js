// controllers/petsController.js
const Pet = require("../models/Pet_temp");
const Tutor = require("../models/Tutor_temp");

// Obter todos os pets do tutor
exports.getPets = async (req, res) => {
  try {
    const tutor = await Tutor.findOne({ user: req.user._id });
    if (!tutor) {
      return res.status(404).json({ message: "Tutor não encontrado" });
    }

    const pets = await Pet.find({ tutor: tutor._id });
    res.json(pets);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erro no servidor" });
  }
};

// Obter um pet específico
exports.getPetById = async (req, res) => {
  const { id } = req.params;

  try {
    const pet = await Pet.findById(id);
    if (!pet) {
      return res.status(404).json({ message: "Pet não encontrado" });
    }

    // Verifica se o pet pertence ao tutor
    const tutor = await Tutor.findOne({ user: req.user._id });
    if (pet.tutor.toString() !== tutor._id.toString()) {
      return res.status(403).json({ message: "Acesso negado" });
    }

    res.json(pet);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erro no servidor" });
  }
};

// Criar um novo pet
exports.createPet = async (req, res) => {
  const { nome, raca, nascimento, peso, pesoRacao } = req.body;

  try {
    const tutor = await Tutor.findOne({ user: req.user._id });
    if (!tutor) {
      return res.status(404).json({ message: "Tutor não encontrado" });
    }

    const pet = new Pet({
      tutor: tutor._id,
      nome,
      raca,
      nascimento,
      peso,
      pesoRacao,
      imagem: req.file ? req.file.path : undefined,
    });

    await pet.save();

    res.status(201).json({ message: "Pet criado com sucesso", pet });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erro no servidor" });
  }
};

// Atualizar informações do pet
exports.updatePet = async (req, res) => {
  const { id } = req.params;
  const { nome, raca, nascimento, peso, pesoRacao } = req.body;

  try {
    const pet = await Pet.findById(id);
    if (!pet) {
      return res.status(404).json({ message: "Pet não encontrado" });
    }

    // Verifica se o pet pertence ao tutor
    const tutor = await Tutor.findOne({ user: req.user._id });
    if (pet.tutor.toString() !== tutor._id.toString()) {
      return res.status(403).json({ message: "Acesso negado" });
    }

    if (nome) pet.nome = nome;
    if (raca) pet.raca = raca;
    if (nascimento) pet.nascimento = nascimento;
    if (peso) pet.peso = peso;
    if (pesoRacao) pet.pesoRacao = pesoRacao;
    if (req.file) pet.imagem = req.file.path;

    await pet.save();

    res.json({ message: "Pet atualizado com sucesso", pet });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erro no servidor" });
  }
};

// Deletar um pet
exports.deletePet = async (req, res) => {
  const { id } = req.params;

  try {
    const pet = await Pet.findById(id);
    if (!pet) {
      return res.status(404).json({ message: "Pet não encontrado" });
    }

    // Verifica se o pet pertence ao tutor
    const tutor = await Tutor.findOne({ user: req.user._id });
    if (pet.tutor.toString() !== tutor._id.toString()) {
      return res.status(403).json({ message: "Acesso negado" });
    }

    await pet.remove();

    res.json({ message: "Pet deletado com sucesso" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erro no servidor" });
  }
};
