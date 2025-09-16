import twilio from "twilio";
import { config } from "../config";

let client: ReturnType<typeof twilio> | null = null;

export function getSmsClient() {
  if (!client) {
    if (config.sms.provider !== "twilio") {
      throw new Error("Only twilio provider is wired in placeholder");
    }
    if (!config.sms.accountSid || !config.sms.authToken) {
      throw new Error("Twilio credentials missing");
    }
    client = twilio(config.sms.accountSid, config.sms.authToken);
  }
  return client;
}

export async function sendSms(to: string, body: string) {
  const tw = getSmsClient();
  const msg = await tw.messages.create({ to, from: config.sms.from, body });
  return msg.sid;
}
