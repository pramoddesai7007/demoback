// const { transporter } = require("./email");
require('dotenv').config();

const transporter = require("./email");
const MAIL_ID=process.env.MAIL_ID

function sendPasswordResetEmail(username, resetToken) {
    // Email content
    const mailOptions = {
        from: MAIL_ID, // Your email address
        to: username, // Recipient's email address
        subject: 'Password Reset', // Email subject
        text: `You are receiving this email because you (or someone else) have requested the reset of the password for your account.\n\n
        Please click on the following link, or paste this into your browser to complete the process:\n\n
        http://localhost:3000/resetPassword/${resetToken}\n\n
        If you did not request this, please ignore this email and your password will remain unchanged.\n`, // Email body
    };

    // Send the email
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending password reset email:', error);
        } else {
            console.log('Password reset email sent:', info.response);
        }
    });
}

function sendPasswordReportEmail(username, resetToken) {
    // Email content
    const mailOptions = {
        from: MAIL_ID, // Your email address
        to: username, // Recipient's email address
        subject: 'Password Reset', // Email subject
        text: `You are receiving this email because you (or someone else) have requested the reset of the password for your account.\n\n
        Please click on the following link, or paste this into your browser to complete the process:\n\n
        http://localhost:3000/resetReport/${resetToken}\n\n
        If you did not request this, please ignore this email and your password will remain unchanged.\n`, // Email body
    };

    // Send the email
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending password reset email:', error);
        } else {
            console.log('Password reset email sent:', info.response);
        }
    });
}




module.exports = { sendPasswordResetEmail,sendPasswordReportEmail};
