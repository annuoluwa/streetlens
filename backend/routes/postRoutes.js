
const express = require('express');
const { createPost } = require('../controllers/postController');
const { protect } = require('../middleware/protect');

const router = express.Router();

// CREATE POST
router.post('/', protect, createPost);

module.exports = router;
