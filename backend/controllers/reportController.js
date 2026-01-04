const pool = require('../db/db');
const reportModel = require('../models/reportModel');

// Delete a report (user can only delete their own, or admin)
const deleteReport = async (req, res) => {
  try {
    // Require authentication
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    const { id } = req.params;
    // Get the report to check ownership
    const reportRes = await pool.query('SELECT user_id FROM reports WHERE id = $1', [id]);
    if (reportRes.rows.length === 0) {
      return res.status(404).json({ message: 'Report not found' });
    }
    const reportOwnerId = reportRes.rows[0].user_id;
    // Only allow if user is owner or admin
    const isAdmin = req.user && req.user.role === 'admin';
    if (reportOwnerId !== req.user.id && !isAdmin) {
      return res.status(403).json({ message: 'You do not have permission to delete this report' });
    }
    // Delete evidence files first (if any)
    await pool.query('DELETE FROM evidence_files WHERE report_id = $1', [id]);
    // Delete the report
    await pool.query('DELETE FROM reports WHERE id = $1', [id]);
    res.status(200).json({ message: 'Report deleted successfully' });
  } catch (error) {
    console.error('Error in deleteReport:', error);
    res.status(500).json({ message: 'Failed to delete report', error: error.message });
  }
};



const createReport = async (req, res) => {
  try {
    // Require authentication
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: 'Authentication required to submit a report' });
    }
    // Multer parses form fields as strings, so convert as needed
    const {
      title,
      description,
      city,
      postcode,
      street,
      property_type,
      landlord_or_agency,
      advert_source,
          flat_number,
      category,
      is_anonymous,
      flagged,
    } = req.body;

    // Multiple files (multer array)
    const evidenceFiles = req.files;

    if (!title || !description || !street) {
      return res.status(400).json({ message: 'Title, description, and street are required' });
    }

    // Debug: log incoming data and user
    console.log('Creating report with:', {
      userId: req.user && req.user.id,
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
      evidenceFiles: evidenceFiles ? evidenceFiles.map(f => f.filename) : []
    });

    // Insert report 
    const result = await pool.query(
      `INSERT INTO reports 
        (user_id, title, description, city, postcode, street, flat_number, property_type, landlord_or_agency, advert_source, category, is_anonymous, is_flagged)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)
       RETURNING *`,
      [
        req.user && req.user.id,
        title,
        description,
        city || null,
        postcode || null,
        street || null,
        flat_number || null,
        property_type || null,
        landlord_or_agency || null,
        advert_source || null,
        category || null,
        is_anonymous === 'false' ? false : true,
        flagged === 'true' || flagged === true
      ]
    );

    const report = result.rows[0];

    // Insert evidence files
    if (evidenceFiles && evidenceFiles.length > 0) {
      for (const file of evidenceFiles) {
        await pool.query(
          `INSERT INTO evidence_files (report_id, file_name) VALUES ($1, $2)`,
          [report.id, file.filename]
        );
      }
    }

    res.status(201).json(report);
  } catch (error) {
    console.error('Error in createReport:', error);
    res.status(500).json({ message: 'Failed to create report', error: error.message, stack: error.stack });
  }
};


const getReports = async (req, res) => {
  try {
    const { search, city, category } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    // Get filtered reports
    const reports = await reportModel.getFilteredReports({ search, city, category, limit, offset });

    // Get total count for pagination (with filters)
    let countQuery = 'SELECT COUNT(*) FROM reports WHERE 1=1';
    const values = [];
    let count = 1;
    if (search) {
      countQuery += ` AND (title ILIKE $${count} OR description ILIKE $${count} OR street ILIKE $${count})`;
      values.push(`%${search}%`);
      count++;
    }
    if (city) {
      countQuery += ` AND city ILIKE $${count}`;
      values.push(`%${city}%`);
      count++;
    }
    if (category) {
      countQuery += ` AND category ILIKE $${count}`;
      values.push(`%${category}%`);
      count++;
    }
    const { rows } = await pool.query(countQuery, values);
    const total = parseInt(rows[0].count);

    res.json({
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      data: reports
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch reports' });
  }
};



const getReportById = async (req, res) => {
  try {
    const { id } = req.params;
    const report = await reportModel.getReportById(id);
    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }
    // Get all evidence files for this report
    const evidenceRes = await pool.query(
      'SELECT file_name FROM evidence_files WHERE report_id = $1 ORDER BY id ASC',
      [id]
    );
    report.evidence_files = evidenceRes.rows.map(row => row.file_name);
    res.status(200).json(report);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch report' });
  }
};

module.exports = {
  createReport,
  getReports,
  getReportById,
  deleteReport,
};
