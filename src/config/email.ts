import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
    secure: true,
    host: 'smtp.gmail.com',
    port: 465,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
})

const sendEmail = async ({ to, subject, html }: { to: string, subject: string, html: string }) => {
    try {
        await transporter.sendMail({
            from: `Fill Job <${process.env.EMAIL_USER}>`,
            to,
            subject,
            html
        });
        return true;
    } catch (error: any) {
        console.error('Error sending email:', error.message);
        return false;
    }
}

export default sendEmail