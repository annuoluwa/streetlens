const sendMail = require('./mailer');
const logger = require('../logger');

async function sendAdminFlaggedNotification({ postcode, street, flat_number, count }) {
  try {
    await sendMail({
      to: process.env.CONTACT_EMAIL,
      subject: 'StreetLens: Reports flagged for admin review',
      text: `Threshold reached for reports at:\nStreet: ${street}\nPostcode: ${postcode}\nFlat: ${flat_number}\nCount in last 30 days: ${count}\n\nReview in the admin dashboard.`,
    });
  } catch (err) {
    logger.error(`Admin notify email failed: ${err.message}`);
  }
}

module.exports = { sendAdminFlaggedNotification };