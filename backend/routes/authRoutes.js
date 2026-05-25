const express = require('express');
const router = express.Router();

const { register, login, resetPassword, forgotPassword, resetPasswordByToken, verifyEmail } = require('../controllers/authController');
const { protect } = require('../middleware/protect');

//POST/api/auth/register
router.post('/register', register);

//POST/api/auth/login
router.post('/login', login);

//POST/api/auth/reset-password (authenticated — change password from profile)
router.post('/reset-password', protect, resetPassword);

//POST/api/auth/forgot-password (public — request email link)
router.post('/forgot-password', forgotPassword);

//GET/api/auth/verify-email/:token (public — confirm email address)
router.get('/verify-email/:token', verifyEmail);

//POST/api/auth/reset-password/:token (public — set new password via email link)
router.post('/reset-password/:token', resetPasswordByToken);

module.exports = router;