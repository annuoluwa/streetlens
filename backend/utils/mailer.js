const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'smtp.resend.com',
  port: 465,
  secure: true,
  auth: {
    user: 'resend',
    pass: process.env.RESEND_API_KEY,
  },
});

const FROM_ADDRESS = process.env.RESEND_FROM || 'StreetLens <onboarding@resend.dev>';

function sendMail(options) {
  return transporter.sendMail({ from: FROM_ADDRESS, ...options });
}

module.exports = sendMail;
