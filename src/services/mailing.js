import mailer from 'nodemailer';
import config from '../config/config.js';

export default class MailingService {
    constructor() {
        this.client = mailer.createTransport({
            service: config.mailing.SERVICE,
            port: 587,
            auth: {
                user: config.mailing.USER,
                pass: config.mailing.PASSWORD
            }
        });
    }

    async sendSimpleMail(mailOptions) {
        try {
            const result = await this.client.sendMail(mailOptions);
            return result;
        } catch (error) {
            console.error('Error sending email:', error);
            throw error;
        }
    }
}