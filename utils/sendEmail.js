// utils/sendEmail.js
const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: `Prato de Ração <${process.env.EMAIL_USER}>`,
    to: options.to,
    subject: options.subject,
    text: options.text,  // Conteúdo de fallback se o HTML falhar
    html: options.html   // Conteúdo formatado em HTML
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
