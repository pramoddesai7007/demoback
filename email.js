require('dotenv').config();
const MAIL_ID=process.env.MAIL_ID
const MAIL_PASS=process.env.MAIL_PASS

const nodemailer = require('nodemailer');

// Create a transporter with your email provider's settings
const transporter = nodemailer.createTransport({
    service: 'Gmail', // Use your email provider (e.g., 'Gmail', 'Outlook')
    auth: {
        user: MAIL_ID, // Your email address
        pass: MAIL_PASS, // Your email password (consider using environment variables)
    },
});

module.exports = transporter;
