import nodemailer from 'nodemailer';
export declare function getEmailTransporter(): nodemailer.Transporter<any, nodemailer.TransportOptions>;
export declare function sendMail(to: string, subject: string, html: string): Promise<any>;
//# sourceMappingURL=email.d.ts.map