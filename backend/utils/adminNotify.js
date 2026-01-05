const nodemailer = require('nodemailer');

// Configure transporter 
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.ADMIN_EMAIL_USER, // admin email
    pass: process.env.ADMIN_EMAIL_PASS, // email password or app password
  },
});

async function sendAdminFlaggedNotification({ postcode, street, flat_number, count }) {
  const mailOptions = {
    from: process.env.ADMIN_EMAIL_USER,
    to: process.env.ADMIN_NOTIFY_TO || process.env.ADMIN_EMAIL_USER, 
    subject: 'StreetLens: Reports flagged for admin review',
    text: `Threshold reached for reports at:\nStreet: ${street}\nPostcode: ${postcode}\nFlat Number: ${flat_number}\nCount in last 30 days: ${count}\n\nPlease review these reports in the admin dashboard.`
  };
  await transporter.sendMail(mailOptions);
}

module.exports = { sendAdminFlaggedNotification };