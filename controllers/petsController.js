const Pet = require('./models/Pet');
const Tutor = require('./models/Tutor');

exports.createPet = async (req, res) => {
  const { nome, raca, nascimento, peso, pesoRacao, tutorId } = req.body;

  try {
    const tutor = await Tutor.findById(tutorId);
    if (!tutor) {
      return res.status(404).json({ message: 'Tutor não encontrado' });
    }

    const pet = new Pet({
      nome,
      raca,
      nascimento,
      peso,
      pesoRacao,
      tutor: tutor._id,
    });

    await pet.save();
    res.status(201).json({ message: 'Pet cadastrado com sucesso', pet });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao cadastrar pet', error: error.message });
  }
};
