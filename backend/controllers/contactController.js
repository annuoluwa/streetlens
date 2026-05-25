const sendMail = require('../utils/mailer');
const logger = require('../logger');

const sendContactMessage = async (req, res) => {
  try {
    const { name, email, message } = req.body || {};

    if (!process.env.CONTACT_EMAIL) {
      return res.status(500).json({ message: 'Contact service is not configured.' });
    }

    if (!name || !email || !message) {
      return res.status(400).json({ message: 'Name, email and message are required.' });
    }

    await sendMail({
      to: process.env.CONTACT_EMAIL,
      replyTo: email,
      subject: `StreetLens contact: ${name}`,
      text: `From: ${name} <${email}>\n\nMessage:\n${message}`,
    });

    return res.status(200).json({ message: 'Message sent successfully.' });
  } catch (error) {
    logger.error(`Contact form email failed: ${error.message}`);
    return res.status(500).json({ message: 'Failed to send message.' });
  }
};

module.exports = { sendContactMessage };
