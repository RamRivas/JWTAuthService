import { Transporter, createTransport } from 'nodemailer';
import { Options } from 'nodemailer/lib/mailer';
import { SentMessageInfo } from 'nodemailer/lib/smtp-transport';
import dotenv from 'dotenv';

dotenv.config();

const { SENDER_EMAIL, SENDER_PWD } = process.env;

const transport: Transporter = createTransport({
    service: 'gmail',
    auth: {
        user: SENDER_EMAIL,
        pass: SENDER_PWD,
    },
});

export const send = async (body: Options): Promise<SentMessageInfo> => {
    try {
        const mailOptions = {
            from: SENDER_EMAIL,
            ...body,
        };

        const result: SentMessageInfo = await transport.sendMail(mailOptions);

        return result;
    } catch (error) {
        if (error instanceof Error) {
            throw error;
        } else {
            throw new Error('Unexpected error');
        }
    }
};
