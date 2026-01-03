const express = require('express');
const router = express.Router();

const { createReport, getReports, getReportById } = require('../controllers/reportController');
const { protect } = require('../middleware/protect');
const upload = require('../middleware/upload');

// Create a new report (authenticated, with multiple file upload)
router.post('/', protect, upload.array('evidence', 10), createReport);

// Get all reports (public feed)
router.get('/', getReports);

// Get single report by ID
router.get('/:id', getReportById);

module.exports = router;
