"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEmailTransporter = getEmailTransporter;
exports.sendMail = sendMail;
const nodemailer_1 = __importDefault(require("nodemailer"));
const config_1 = require("../config");
let transporter = null;
function getEmailTransporter() {
    if (!transporter) {
        if (!config_1.config.email.smtpUrl) {
            throw new Error('SMTP_URL not configured');
        }
        transporter = nodemailer_1.default.createTransport(config_1.config.email.smtpUrl);
    }
    return transporter;
}
async function sendMail(to, subject, html) {
    const tx = getEmailTransporter();
    const info = await tx.sendMail({ from: config_1.config.email.from, to, subject, html });
    return info.messageId;
}
//# sourceMappingURL=email.js.map