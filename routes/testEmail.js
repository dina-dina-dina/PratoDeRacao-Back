// backend/routes/testEmail.js
const express = require('express');
const router = express.Router();
const sendEmail = require('../utils/sendEmail');

router.post('/send-test-email', async (req, res) => {
  const { to } = req.body;
  const message = `<p>Este é um email de teste da Pet Tech.</p>`;

  try {
    await sendEmail({
      to,
      subject: 'Email de Teste',
      html: message,
    });
    res.json({ message: 'Email de teste enviado com sucesso.' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao enviar email de teste.', error: error.message });
  }
});

module.exports = router;
