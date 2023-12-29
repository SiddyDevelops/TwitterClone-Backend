import nodemailer from 'nodemailer';

export async function sendMail({ from, to, subject, text, html} : { from:string, to:string, subject:string, text:string, html:string}) {
    let transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: false,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASSWORD
        }
    } as nodemailer.TransportOptions);

    let info = await transporter.sendMail({
        from: `${from}`,
        to: to,
        subject: subject,
        text: text,
        html: html
    });
}