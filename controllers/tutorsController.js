const Tutor = require('../models/Tutor_temp');

exports.createTutor = async (req, res) => {
  const { nome, email, telefone } = req.body;

  try {
    const existingTutor = await Tutor.findOne({ email });
    if (existingTutor) {
      return res.status(400).json({ message: 'Tutor já cadastrado' });
    }

    const tutor = new Tutor({
      nome,
      email,
      telefone,
    });

    await tutor.save();
    res.status(201).json({ message: 'Tutor cadastrado com sucesso', tutor });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao cadastrar tutor', error: error.message });
  }
};
