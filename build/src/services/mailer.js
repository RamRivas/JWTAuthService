'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.send = void 0;
const nodemailer_1 = require('nodemailer');
const { SENDER_EMAIL, SENDER_PWD } = process.env;
const transport = (0, nodemailer_1.createTransport)({
    service: 'gmail',
    auth: {
        user: SENDER_EMAIL,
        pass: SENDER_PWD,
    },
});
const send = async (body) => {
    try {
        const mailOptions = {
            from: SENDER_EMAIL,
            ...body,
        };
        const result = await transport.sendMail(mailOptions);
        return result;
    } catch (error) {
        if (error instanceof Error) {
            throw error;
        } else {
            throw new Error('Unexpected error');
        }
    }
};
exports.send = send;
