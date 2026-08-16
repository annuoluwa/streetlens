const sendMail = require('../utils/mailer');
const logger = require('../logger');
const { sendCapiEvent } = require('../utils/metaCapi');

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

    sendCapiEvent({
      eventName: 'Lead',
      sourceUrl: `${process.env.FRONTEND_URL || 'https://streetlens.kagex.co.uk'}/contact`,
      eventId: req.body.eventId || undefined,
      userData: { email },
      req,
    }).catch(err => logger.error(`CAPI Lead failed: ${err.message}`));

    return res.status(200).json({ message: 'Message sent successfully.' });
  } catch (error) {
    logger.error(`Contact form email failed: ${error.message}`);
    return res.status(500).json({ message: 'Failed to send message.' });
  }
};

module.exports = { sendContactMessage };
