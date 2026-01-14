
const path = require('path');
const fs = require('fs');
const emailMap = JSON.parse(fs.readFileSync(path.join(__dirname, 'email.json'), 'utf8'));

/**
 * Returns the correct authority for a report.
 * @param {Object} report - Report object (should have category and city fields).
 * @returns {Object} - Authority object: { name: string, contact: string }
 */

function getAuthorityForReport(report) {
  // Match by council name, city, or local_authority
  const councilName = report.councilName || report.city || report.local_authority;
  if (councilName && emailMap[councilName]) {
    return {
      name: councilName,
      contact: emailMap[councilName]
    };
  }
  // Fallback: default authority
    return {
      name: 'Default Authority',
      contact: 'default@council.gov.uk'
  };
}

module.exports = getAuthorityForReport;
