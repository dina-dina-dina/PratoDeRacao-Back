// backend/utils/sendEmail.js
const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  try {
    // Configuração do transportador
    const transporter = nodemailer.createTransport({
      service: 'Gmail', // Ou outro serviço
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Verificar a configuração do transporter
    await transporter.verify();

    // Configuração do email
    const mailOptions = {
      from: `"Pet Tech" <${process.env.EMAIL_USER}>`,
      to: options.to,
      subject: options.subject,
      html: options.html,
    };

    // Enviar email
    await transporter.sendMail(mailOptions);
    console.log('Email enviado com sucesso');
  } catch (error) {
    console.error('Erro ao enviar email:', error);
    throw new Error('Falha ao enviar email.');
  }
};

module.exports = sendEmail;
