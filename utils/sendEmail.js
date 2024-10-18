// utils/sendEmail.js
const nodemailer = require('nodemailer');

const sendEmail = async (to, subject, html) => {
  try {
    // Configuração do transporter
    const transporter = nodemailer.createTransport({
      service: 'Gmail', // ou outro serviço de email
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Opções do email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      html,
    };

    // Enviar email
    await transporter.sendMail(mailOptions);
    console.log('Email enviado com sucesso para', to);
  } catch (error) {
    console.error('Erro ao enviar email:', error);
    throw new Error('Erro ao enviar email.');
  }
};

module.exports = sendEmail;
