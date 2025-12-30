const express = require('express');
const router = express.Router();
const { deleteAccount } = require('../controllers/userController');
const { protect } = require('../middleware/protect');

// Delete user account (self-delete)
router.delete('/me', protect, deleteAccount);

module.exports = router;
