const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
    service:process.env.SMTP_HOST,
    
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD
    }
});


const sendMail = async (email, subject, content) => {
    try {
        const mailOptions = {
            from: "Admin",
            to: email,
            subject: subject,
            html: content
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Mail Sent: ', info.messageId);

    } catch (error) {
        console.log('Error in sending mail: ', error);
    }
};

module.exports = {
    sendMail
}