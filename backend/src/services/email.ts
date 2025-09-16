import nodemailer from "nodemailer";
import { config } from "../config";

let transporter: nodemailer.Transporter | null = null;

export function getEmailTransporter() {
  if (!transporter) {
    if (!config.email.smtpUrl) {
      throw new Error("SMTP_URL not configured");
    }
    transporter = nodemailer.createTransport(config.email.smtpUrl);
  }
  return transporter;
}

export async function sendMail(to: string, subject: string, html: string) {
  const tx = getEmailTransporter();
  const info = await tx.sendMail({
    from: config.email.from,
    to,
    subject,
    html,
  });
  return info.messageId;
}
