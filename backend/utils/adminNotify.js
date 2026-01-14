const nodemailer = require('nodemailer');


// Configure transporter for Mailtrap
const transporter = nodemailer.createTransport({
  host: 'sandbox.smtp.mailtrap.io',
  port: 587,
  auth: {
    user: process.env.MAILTRAP_USER || '',
    pass: process.env.MAILTRAP_PASS || process.env.mailtrap || ''
  }
});

async function sendAdminFlaggedNotification({ postcode, street, flat_number, count }) {
  const mailOptions = {
    from: process.env.MAILTRAP_USER,
    to: process.env.ADMIN_NOTIFY_TO || process.env.MAILTRAP_USER,
    subject: 'StreetLens: Reports flagged for admin review',
    text: `Threshold reached for reports at:\nStreet: ${street}\nPostcode: ${postcode}\nFlat Number: ${flat_number}\nCount in last 30 days: ${count}\n\nPlease review these reports in the admin dashboard.`
  };

  try {
    const info = await transporter.sendMail(mailOptions);

  } catch (err) {

  }
}

module.exports = { sendAdminFlaggedNotification };