const transporter = require('../config/mailer');  

const sendEmail = async (to, subject, text, html = null) => {
    const mailOptions = {
        from: process.env.EMAIL,
        to,
        subject,
        text,
        ...(html && { html })
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log(`📧 Email envoyé à ${to} : ${info.response}`);
        return info;
    } catch (error) {
        console.error(`❌ Erreur lors de l'envoi de l'email à ${to} :`, error.message);
        throw error;
    }
};

module.exports = sendEmail;