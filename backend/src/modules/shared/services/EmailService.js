// src/modules/shared/services/EmailService.js
import nodemailer from 'nodemailer';
import authConfig from '../../../config/auth.js';

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.EMAIL_SERVICE_HOST,
      port: Number(process.env.EMAIL_SERVICE_PORT),
      secure: process.env.EMAIL_SERVICE_SECURE === 'true', // O Nodemailer precisa de um booleano
      auth: {
        user: process.env.EMAIL_SERVICE_AUTH_USER,
        pass: process.env.EMAIL_SERVICE_AUTH_PASS,
      },
    });
  }

  async sendMail(to, subject, html) {
    try {
      const mailOptions = {
        from: process.env.EMAIL_FROM_ADDRESS,
        to,
        subject,
        html,
      };

      const info = await this.transporter.sendMail(mailOptions);
      console.log("Mensagem enviada: %s", info.messageId);
      return true;
    } catch (error) {
      console.error("Erro ao enviar o e-mail:", error);
      return false;
    }
  }
}

export function createEmailService() {
  return new EmailService();
}