import nodemailer, { Transporter } from 'nodemailer';
import {
  SMTP_KEY,
  SMTP_LOGIN,
  SMTP_PORT,
  SMTP_SERVER,
} from '../helpers/constants.js';

const transporter = nodemailer.createTransport({
  host: SMTP_SERVER,
  port: Number(SMTP_PORT),
  secure: false,
  auth: {
    user: SMTP_LOGIN,
    pass: SMTP_KEY,
  },
});

interface MailOptions {
  from: string;
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail(options: MailOptions) {
  return await transporter.sendMail(options);
}
