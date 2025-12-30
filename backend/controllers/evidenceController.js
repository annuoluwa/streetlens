const pool = require('../db/db');

const saveEvidence = async (req, res) => {
  try {
    const { reportId } = req.params;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: 'File is required' });
    }


    const result = await pool.query(
      `INSERT INTO evidence_files (report_id, user_id, file_name, file_type, file_size)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [reportId, req.user.id, file.filename, file.mimetype, file.size]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to upload evidence' });
  }
};

module.exports = { saveEvidence };
