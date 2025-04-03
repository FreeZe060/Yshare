const transporter = require('../config/mailer');  

const sendEmail = (to, subject, text) => {
    const mailOptions = {
        from: process.env.EMAIL,  
        to,                          
        subject,                     
        text,                         
    };

    return transporter.sendMail(mailOptions)
        .then(info => {
            console.log('Email sent: ' + info.response);
        })
        .catch(error => {
            console.error('Error sending email: ', error);
        });
};

module.exports = sendEmail;
