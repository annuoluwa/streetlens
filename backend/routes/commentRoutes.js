const express = require('express');
const { createComment } = require('../controllers/commentController');
const { protect } = require('../middleware/protect');

const router = express.Router();

// CREATE COMMENT
router.post('/', protect, createComment);

module.exports = router;
