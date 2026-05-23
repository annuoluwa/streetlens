const express = require('express');
const router = express.Router();
const { memoryUpload } = require('../middleware/upload');
const { protect } = require('../middleware/protect');
const { saveEvidence } = require('../controllers/evidenceController');

// Upload one file per request
router.post(
  '/reports/:reportId/evidence',
  protect,
  memoryUpload.single('file'),
  saveEvidence
);

module.exports = router;
