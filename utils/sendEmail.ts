import nodemailer from "nodemailer";
import { EmailOptions, SendEmailOptions } from "../interfaces";

const sendEmail = async (options: EmailOptions): Promise<void> => {
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: 465,
        secure: true,
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD
        }
    });
    const emailOptions: SendEmailOptions = {
        from: `"${process.env.APP_NAME}" <${process.env.EMAIL_USERNAME}>`,
        to: options.email,
        subject: options.subject,
        text: options.message,
        html: `<h1 dir='rtl'>${options.subject}</h1><h2 dir='rtl'>${options.message}</h2>`
    };
    await transporter.sendMail(emailOptions);
};

export default sendEmail;