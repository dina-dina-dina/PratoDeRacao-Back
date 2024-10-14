// backend/utils/sendEmail.js
const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  // Configuração do transportador
  const transporter = nodemailer.createTransport({
    service: 'Gmail', // Ou outro serviço
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // Configuração do email
  const mailOptions = {
    from: `"Pet Tech" <${process.env.EMAIL_USER}>`,
    to: options.to,
    subject: options.subject,
    html: options.html,
  };

  // Enviar email
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
