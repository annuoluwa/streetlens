const pool = require('../db/db');
const reportModel = require('../models/reportModel');
const logger = require('../logger');

const { countRecentReports, flagRecentReports } = require('../models/reportModel');
const { sendAdminFlaggedNotification } = require('../utils/adminNotify');

const createReport = async (req, res) => {
  if (!req.user || !req.user.id) {
    return res.status(401).json({ message: 'Authentication required to submit a report' });
  }

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

  if (!title || !description) {
    return res.status(400).json({ message: 'Title and description are required' });
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const result = await client.query(
      `INSERT INTO reports
        (user_id, title, description, city, postcode, street, flat_number, property_type, landlord_or_agency, advert_source, category, is_anonymous, is_flagged)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)
       RETURNING *`,
      [
        req.user.id,
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

    const count = await countRecentReports({
      postcode: report.postcode,
      street: report.street,
      flat_number: report.flat_number
    });

    const THRESHOLD = 3;

    if (count >= THRESHOLD) {
      await flagRecentReports({
        postcode: report.postcode,
        street: report.street,
        flat_number: report.flat_number
      });
    }

    await client.query('COMMIT');

    if (count >= THRESHOLD) {
      sendAdminFlaggedNotification({
        postcode: report.postcode,
        street: report.street,
        flat_number: report.flat_number,
        count
      }).catch(err => logger.error(`Admin notification failed: ${err.message}`));
    }

    res.status(201).json(report);
  } catch (error) {
    await client.query('ROLLBACK');
    logger.error(error);
    res.status(500).json({ message: 'Failed to create report' });
  } finally {
    client.release();
  }
};

const updateReport = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const { id } = req.params;
    const {
      title, description, city, postcode, street, flat_number,
      property_type, landlord_or_agency, advert_source, category, is_anonymous,
    } = req.body;

    if (!title || !description) {
      return res.status(400).json({ message: 'Title and description are required' });
    }

    const result = await pool.query(
      `UPDATE reports SET
        title = $1, description = $2, city = $3, postcode = $4, street = $5,
        flat_number = $6, property_type = $7, landlord_or_agency = $8,
        advert_source = $9, category = $10, is_anonymous = $11
       WHERE id = $12 AND user_id = $13
       RETURNING *`,
      [
        title, description, city || null, postcode || null, street || null,
        flat_number || null, property_type || null, landlord_or_agency || null,
        advert_source || null, category || null,
        is_anonymous === true || is_anonymous === 'true',
        id, req.user.id,
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Report not found or permission denied' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    logger.error(error);
    res.status(500).json({ message: 'Failed to update report' });
  }
};

const deleteReport = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const { id } = req.params;

    const reportRes = await pool.query('SELECT user_id FROM reports WHERE id = $1', [id]);
    if (reportRes.rows.length === 0) {
      return res.status(404).json({ message: 'Report not found' });
    }

    const reportOwnerId = reportRes.rows[0].user_id;
    const isAdmin = req.user && req.user.role === 'admin';

    if (reportOwnerId !== req.user.id && !isAdmin) {
      return res.status(403).json({ message: 'Permission denied: insufficient privileges to delete this report.' });
    }

    await pool.query('DELETE FROM evidence_files WHERE report_id = $1', [id]);
    await pool.query('DELETE FROM reports WHERE id = $1', [id]);

    res.status(200).json({ message: 'Report deleted successfully' });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ message: 'Failed to delete report' });
  }
};

const getReports = async (req, res) => {
  try {
    const { search, city, category, admin_flagged } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    let adminFlaggedValue = undefined;
    if (typeof admin_flagged !== 'undefined') {
      if (admin_flagged === 'true' || admin_flagged === true) adminFlaggedValue = true;
      else if (admin_flagged === 'false' || admin_flagged === false) adminFlaggedValue = false;
    }

    const reports = await reportModel.getFilteredReports({ search, city, category, admin_flagged: adminFlaggedValue, limit, offset });

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
    if (typeof adminFlaggedValue !== 'undefined') {
      countQuery += ` AND admin_flagged = $${count}`;
      values.push(adminFlaggedValue);
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
    logger.error(error);
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

    const evidenceRes = await pool.query(
      'SELECT id, file_name, file_url, file_type, file_size, uploaded_at FROM evidence_files WHERE report_id = $1 ORDER BY id ASC',
      [id]
    );

    report.evidence_files = evidenceRes.rows;

    res.status(200).json(report);
  } catch (error) {
    logger.error(error);
     res.status(500).json({ message: 'Failed to fetch report' });
  }
};

const getAuthorityForReport = require('../utils/getAuthorityForReport');
const sendToAuthority = require('../utils/sendToAuthority');

const verifyReport = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status. Must be "approved" or "rejected".' });
    }

    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin privileges required.' });
    }

    let routedAuthority = null;

    if (status === 'approved') {
      const report = await reportModel.getReportById(id);
      if (!report) {
        return res.status(404).json({ message: 'Report not found.' });
      }

      routedAuthority = getAuthorityForReport(report);

      try {
        await sendToAuthority(routedAuthority, report);
      } catch (sendErr) {
        return res.status(500).json({ message: 'Failed to escalate report to authority', error: sendErr.message });
      }

      const { resetEscalationThreshold } = require('../models/reportModel');
      await resetEscalationThreshold({
        postcode: report.postcode,
        street: report.street,
        flat_number: report.flat_number
      });
    }

    const updated = await reportModel.verifyReportStatus(id, status === 'approved');
    if (!updated) {
      return res.status(404).json({ message: 'Report not found or not flagged.' });
    }

    res.status(200).json({ message: `Report ${status}`, routedTo: routedAuthority });
  } catch (error) {
    logger.error(error);
     res.status(500).json({ message: 'Failed to verify report' });
  }
};

module.exports = {
  createReport,
  updateReport,
  getReports,
  getReportById,
  deleteReport,
  verifyReport
};
