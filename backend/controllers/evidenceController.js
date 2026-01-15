const pool = require('../db/db');
const cloudinary = require('../config/cloudinary');

const uploadBufferToCloudinary = (buffer, folder) =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: 'auto' },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    stream.end(buffer);
  });

const saveEvidence = async (req, res) => {
  try {
    const { reportId } = req.params;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: 'File is required' });
    }

    const uploadResult = await uploadBufferToCloudinary(file.buffer, 'streetlens');

    const result = await pool.query(
      `INSERT INTO evidence_files (report_id, file_name, file_type, file_size, file_url)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [
        reportId,
        file.originalname,
        file.mimetype,
        file.size,
        uploadResult.secure_url
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Evidence upload failed:', error);
    res.status(500).json({ message: 'Failed to upload evidence', error: error.message });
  }
};

module.exports = { saveEvidence };
