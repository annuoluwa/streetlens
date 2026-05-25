const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

function sendMail(options) {
  return transporter.sendMail({
    from: `StreetLens <${process.env.MAIL_USER}>`,
    ...options,
  });
}

module.exports = sendMail;
