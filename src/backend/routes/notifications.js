const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

router.post('/email', async (req, res) => {
  const { recipients, subject, content, timestamp } = req.body;
  
  try {
    const mailOptions = {
      from: process.env.SMTP_USER,
      to: recipients.join(', '),
      subject: subject,
      html: `
        <h2>Atualização do Diagrama Mermaid</h2>
        <p>Nova atualização realizada em: ${new Date(timestamp).toLocaleString('pt-BR')}</p>
        <pre>${content}</pre>
        <p>Este é um email automático, por favor não responda.</p>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log('Email de notificação enviado com sucesso');
    res.status(200).json({ message: 'Notificação enviada com sucesso' });
  } catch (error) {
    console.error('Erro ao enviar email:', error);
    res.status(500).json({ error: 'Erro ao enviar notificação' });
  }
});

module.exports = router;