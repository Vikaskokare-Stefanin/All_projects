const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail", // or outlook
    auth: {
        user: "vikasskokare1502@gmail.com",
        pass: "pgnr hbhh dyvk fyxv" // NOT normal password
    }
});

async function sendMail(to, subject, html) {
    return transporter.sendMail({
        from: "vikasskokare1502@gmail.com",
        to,
        subject,
        html
    });
}

module.exports = { sendMail };
