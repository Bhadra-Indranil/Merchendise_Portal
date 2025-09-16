"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSmsClient = getSmsClient;
exports.sendSms = sendSms;
const twilio_1 = __importDefault(require("twilio"));
const config_1 = require("../config");
let client = null;
function getSmsClient() {
    if (!client) {
        if (config_1.config.sms.provider !== 'twilio') {
            throw new Error('Only twilio provider is wired in placeholder');
        }
        if (!config_1.config.sms.accountSid || !config_1.config.sms.authToken) {
            throw new Error('Twilio credentials missing');
        }
        client = (0, twilio_1.default)(config_1.config.sms.accountSid, config_1.config.sms.authToken);
    }
    return client;
}
async function sendSms(to, body) {
    const tw = getSmsClient();
    const msg = await tw.messages.create({ to, from: config_1.config.sms.from, body });
    return msg.sid;
}
//# sourceMappingURL=sms.js.map