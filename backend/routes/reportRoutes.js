
const express = require('express');
const { protect } = require('../middleware/protect');
const upload = require('../middleware/upload');
const { createReport, getReports, getReportById, deleteReport } = require('../controllers/reportController');
const router = express.Router();


// Get all reports (public feed)
router.get('/', getReports);

// Get single report by ID
router.get('/:id', getReportById);

// Create a new report (authenticated, with multiple file upload)
router.post('/', protect, upload.array('evidence', 10), createReport);

// Delete a report by ID (authenticated, only owner or admin)
router.delete('/:id', protect, deleteReport);

module.exports = router;
