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

function sendMail(options) {
  return transporter.sendMail({
    from: process.env.RESEND_FROM || 'StreetLens <onboarding@resend.dev>',
    ...options,
  });
}

module.exports = sendMail;
