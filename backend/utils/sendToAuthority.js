// Uses the mailer utility (nodemailer + Mailtrap SMTP).

const sendMail = require('./mailer');

/**
 * Formats the report details for the email body.
 * @param {Object} report
 * @returns {string}
 */
function formatReport(report) {
  return `
    Report ID: ${report.id}
    Title: ${report.title}
    Description: ${report.description}
    City: ${report.city}
    Category: ${report.category}
    Street: ${report.street}
    Postcode: ${report.postcode}
    Property Type: ${report.property_type}
    Landlord/Agency: ${report.landlord_or_agency}
    Advert Source: ${report.advert_source}
    Anonymous: ${report.is_anonymous ? 'Yes' : 'No'}
    Created At: ${report.created_at}
  `;
}

/**
 * Sends report details to the specified authority via email.
 * @param {Object} authority - Authority object ({ name, contact })
 * @param {Object} report - Report object to send
 * @returns {Promise<void>}
 */
async function sendToAuthority(authority, report) {
  // Compose email
  const mailOptions = {
    from: 'noreply@streetlens.app',
    to: authority.contact,
    subject: `New Report Escalated: ${report.title}`,
    text: `Dear ${authority.name},\n\nA new report has been escalated to your office.\n\n${formatReport(report)}\n\nPlease review and take appropriate action.\n\n--\nStreetlens Automated System`,
  };
  // Send email using Mailtrap
  await sendMail(mailOptions);

}

module.exports = sendToAuthority;
