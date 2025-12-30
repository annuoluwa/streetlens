const pool = require('../db/db');

// Create a new report

const createReport = async ({
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
  is_anonymous
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
      landlord_or_agency,
      advert_source,
      category,
      is_anonymous
    )
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
    RETURNING
      id,
      title,
      description,
      city,
      category,
      is_anonymous,
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
      is_anonymous
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

// Get report by ID
const getReportById = async (reportId) => {
  const result = await pool.query(
    `
    SELECT
      r.id,
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
      r.created_at
    FROM reports r
    WHERE r.id = $1
    `,
    [reportId]
  );

  return result.rows[0];
};

// Advanced filtering function
const getFilteredReports = async ({ search, city, category, limit = 10, offset = 0 }) => {
  let baseQuery = `
    SELECT *
    FROM reports
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
