const sendMail = require('../utils/mailer');

const CONTACT_EMAIL = process.env.CONTACT_EMAIL;

const sendContactMessage = async (req, res) => {
  try {
    const { name, email, message } = req.body || {};

    if (!CONTACT_EMAIL) {
      return res.status(500).json({ message: 'Contact service is not configured.' });
    }

    if (!name || !email || !message) {
      return res.status(400).json({ message: 'Name, email and message are required.' });
    }

    const mailOptions = {
      from: email,
      to: CONTACT_EMAIL,
      subject: `StreetLens contact form: ${name}`,
      text: `New contact message from StreetLens landing page.\n\nFrom: ${name} <${email}>\n\nMessage:\n${message}`,
    };

    await sendMail(mailOptions);

    return res.status(200).json({ message: 'Message sent successfully.' });
  } catch (error) {
    // Avoid leaking internals; log on server in future if needed
    return res.status(500).json({ message: 'Failed to send message.' });
  }
};

module.exports = { sendContactMessage };
