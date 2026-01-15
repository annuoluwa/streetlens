// Reset escalation threshold for an apartment by updating last_escalated_at
const resetEscalationThreshold = async ({ postcode, street, flat_number }) => {
  await pool.query(
    `UPDATE reports SET last_escalated_at = NOW()
     WHERE postcode = $1 AND street = $2 AND flat_number = $3
       AND created_at >= NOW() - INTERVAL '30 days'`,
    [postcode, street, flat_number]
  );
};

const pool = require('../db/db');



const createReport = async ({
  user_id,
  title,
  description,
  city,
  postcode,
  street,
  property_type,
  landlord_or_agency,
  flat_number,
  advert_source,
  category,
  is_anonymous,
  is_flagged = false,
  admin_flagged = false
}) => {
  const result = await pool.query(
    `
    INSERT INTO reports (
      user_id,
      title,
      description,
      city,
      postcode,
      street,
      property_type,
      flat_number,
      landlord_or_agency,
      advert_source,
      category,
      is_anonymous,
      is_flagged,
      admin_flagged
    )
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)
    RETURNING
      id,
      title,
      description,
      city,
      flat_number,
      category,
      is_anonymous,
      is_flagged,
      admin_flagged,
      created_at
    `,
    [
      user_id,
      title,
      description,
      city,
      postcode,
      street,
      property_type,
      landlord_or_agency,
      advert_source,
      category,
      flat_number,
      is_anonymous,
      is_flagged,
      admin_flagged
    ]
  );

  return result.rows[0];
};


const getAllReports = async () => {
  const result = await pool.query(
    `
    SELECT
      r.id,
      r.title,
      r.description,
      r.city,
      r.category,
      r.is_anonymous,
      r.created_at
    FROM reports r
    ORDER BY r.created_at DESC
    `
  );

  return result.rows;
};


const getReportById = async (reportId) => {
  const result = await pool.query(
    `
    SELECT
      r.id,
      r.user_id,
      r.title,
      r.description,
      r.city,
      r.postcode,
      r.street,
      r.property_type,
      r.landlord_or_agency,
      r.advert_source,
      r.category,
      r.is_anonymous,
      r.is_flagged,
      r.created_at
    FROM reports r
    WHERE r.id = $1
    `,
    [reportId]
  );

  return result.rows[0];
};


const getFilteredReports = async ({ search, city, category, admin_flagged, limit = 10, offset = 0 }) => {
  let baseQuery = `
    SELECT r.*, (
      SELECT file_name FROM evidence_files ef WHERE ef.report_id = r.id ORDER BY ef.id ASC LIMIT 1
    ) AS evidence,
    (
      SELECT file_url FROM evidence_files ef WHERE ef.report_id = r.id ORDER BY ef.id ASC LIMIT 1
    ) AS evidence_url
    FROM reports r
    WHERE 1=1
  `;
  const values = [];
  let count = 1;

  if (search) {
    baseQuery += ` AND (title ILIKE $${count} OR description ILIKE $${count} OR street ILIKE $${count})`;
    values.push(`%${search}%`);
    count++;
  }

  if (city) {
    baseQuery += ` AND city ILIKE $${count}`;
    values.push(`%${city}%`);
    count++;
  }

  if (category) {
    baseQuery += ` AND category ILIKE $${count}`;
    values.push(`%${category}%`);
    count++;
  }

  if (typeof admin_flagged !== 'undefined') {
    baseQuery += ` AND admin_flagged = $${count}`;
    values.push(admin_flagged);
    count++;
  }

  baseQuery += ` ORDER BY created_at DESC LIMIT $${count} OFFSET $${count + 1}`;
  values.push(limit, offset);

  const result = await pool.query(baseQuery, values);
  return result.rows;
};


// Count reports for a given (postcode, street, flat_number) in the last 30 days
const countRecentReports = async ({ postcode, street, flat_number }) => {
  const result = await pool.query(
    `SELECT COUNT(*) FROM reports
     WHERE postcode = $1 AND street = $2 AND flat_number = $3
       AND created_at >= NOW() - INTERVAL '30 days'`,
    [postcode, street, flat_number]
  );
  return parseInt(result.rows[0].count, 10);
};

// Flag all reports for a given (postcode, street, flat_number) in the last 30 days (admin/system flag)
const flagRecentReports = async ({ postcode, street, flat_number }) => {
  await pool.query(
    `UPDATE reports SET admin_flagged = true
     WHERE postcode = $1 AND street = $2 AND flat_number = $3
       AND created_at >= NOW() - INTERVAL '30 days'`,
    [postcode, street, flat_number]
  );
};


// Admin: verify (approve/reject) a flagged report
const verifyReportStatus = async (id, status) => {
  // Only update if currently flagged
  const res = await pool.query(
    `UPDATE reports SET admin_verified = $1, admin_flagged = false WHERE id = $2 AND admin_flagged = true RETURNING id`,
    [status, id]
  );
  return res.rowCount > 0;
};

module.exports = {
  createReport,
  getAllReports,
  getReportById,
  getFilteredReports,
  countRecentReports,
  flagRecentReports,
  verifyReportStatus,
  resetEscalationThreshold
};
