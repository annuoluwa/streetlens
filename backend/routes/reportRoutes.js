const express = require('express');
const router = express.Router();
const { createReport, getReports, getReportById } = require('../controllers/reportController');
const { protect } = require('../middleware/protect'); // keeps track of authenticated user

// Create a new report (authenticated)
router.post('/', protect, createReport);

// Get all reports (public feed)
router.get('/', getReports);

// Get single report by ID
router.get('/:id', getReportById);

module.exports = router;
