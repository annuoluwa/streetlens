
const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  host: 'sandbox.smtp.mailtrap.io',
  port: 587,
  auth: {
    user: process.env.MAILTRAP_USER || '',
    pass: process.env.MAILTRAP_PASS || process.env.mailtrap || ''
  }
});

/**
 * Sends an email using Mailtrap.
 * @param {Object} options - Nodemailer mail options (to, subject, text, html)
 * @returns {Promise}
 */
function sendMail(options) {
  return transporter.sendMail(options);
}

module.exports = sendMail;
