declare namespace NodeJS {
  interface ProcessEnv {
    PORT?: string;
    MONGO_URI?: string;
    JWT_SECRET?: string;
    RAZORPAY_KEY_ID?: string;
    RAZORPAY_KEY_SECRET?: string;
    RAZORPAY_WEBHOOK_SECRET?: string;
    SMTP_URL?: string;
    EMAIL_FROM?: string;
    SMS_PROVIDER?: string;
    TWILIO_ACCOUNT_SID?: string;
    TWILIO_AUTH_TOKEN?: string;
    TWILIO_FROM?: string;
  }
}
