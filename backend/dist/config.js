"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.config = {
    port: process.env.PORT ? Number(process.env.PORT) : 4000,
    mongoUri: process.env.MONGO_URI || "mongodb://127.0.0.1:27017/merch_portal",
    jwtSecret: process.env.JWT_SECRET || "change_me_in_production",
    razorpay: {
        keyId: process.env.RAZORPAY_KEY_ID || "",
        keySecret: process.env.RAZORPAY_KEY_SECRET || "",
        webhookSecret: process.env.RAZORPAY_WEBHOOK_SECRET || "",
    },
    email: {
        smtpUrl: process.env.SMTP_URL || "",
        from: process.env.EMAIL_FROM || "no-reply@example.com",
    },
    sms: {
        provider: process.env.SMS_PROVIDER || "twilio",
        accountSid: process.env.TWILIO_ACCOUNT_SID || "",
        authToken: process.env.TWILIO_AUTH_TOKEN || "",
        from: process.env.TWILIO_FROM || "",
    },
};
//# sourceMappingURL=config.js.map