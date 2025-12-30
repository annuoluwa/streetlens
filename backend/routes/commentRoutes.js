const express = require('express');
const router = express.Router();
const {
  createReportComment,
  getReportComments,
  deleteReportComment
} = require('../controllers/commentController');

const { protect } = require('../middleware/protect');

// Create comment on a report
router.post(
  '/reports/:reportId/comments',
  protect,
  createReportComment
);

// Get comments for a report
router.get(
  '/reports/:reportId/comments',
  getReportComments
);

// Delete a comment by id (protected)
router.delete('/comments/:commentId', protect, deleteReportComment);

module.exports = router;
