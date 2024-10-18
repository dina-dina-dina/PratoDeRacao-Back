// utils/sendEmail.js
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

dotenv.config();

const sendEmail = async (to, subject, text) => {
  // Configuração do transporter
  const transporter = nodemailer.createTransport({
    service: 'Gmail', // Ou outro serviço de email
    auth: {
      user: process.env.EMAIL_USER, // Seu email
      pass: process.env.EMAIL_PASS, // Sua senha de email
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    text,
  };

  // Enviar email
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
