require("dotenv/config");
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: process.env.SMTP_SECURE == "true" ? true : false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});

module.exports = (email, token) => {
    transporter.sendMail({
        from: `Dev.Caio <${process.env.SMTP_USER}>`,
        to: email,
        subject: "Teste NodeMailer",
        html: `Prezado(a)
            <a href='${process.env.DEPLOY}?token=${token}'>Clique aqui<a> para redefinição de senha`
    }).then(() => {
        return {
            status: true
        }
    }).catch(err => {
        return {
            status: false,
            err: err
        }
    })
}