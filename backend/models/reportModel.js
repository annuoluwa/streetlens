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
  is_flagged = false
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
      is_flagged
    )
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
    RETURNING
      id,
      title,
      description,
      city,
      flat_number,
      category,
      is_anonymous,
      is_flagged,
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
      r.flat_number,
      is_anonymous,
      is_flagged
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


const getFilteredReports = async ({ search, city, category, limit = 10, offset = 0 }) => {
  let baseQuery = `
    SELECT r.*, (
      SELECT file_name FROM evidence_files ef WHERE ef.report_id = r.id ORDER BY ef.id ASC LIMIT 1
    ) AS evidence
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

  baseQuery += ` ORDER BY created_at DESC LIMIT $${count} OFFSET $${count + 1}`;
  values.push(limit, offset);

  const result = await pool.query(baseQuery, values);
  return result.rows;
};


module.exports = {
  createReport,
  getAllReports,
  getReportById,
  getFilteredReports
};
