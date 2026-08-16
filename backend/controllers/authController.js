const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { createUser, findUserByEmail, findUserById, updateUserPassword, setResetToken, findUserByResetToken, clearResetToken, setVerificationToken, verifyEmailToken } = require('../models/userModel');

const isStrongPassword = (pw) =>
    pw && pw.length >= 8 && /[a-zA-Z]/.test(pw) && /[0-9]/.test(pw);
const sendMail = require('../utils/mailer');
const logger = require('../logger');
const { sendCapiEvent } = require('../utils/metaCapi');

const FRONTEND = process.env.FRONTEND_URL || 'https://streetlens.kagex.co.uk';


const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!isStrongPassword(password)) {
            return res.status(400).json({ message: 'Password must be at least 8 characters and include a letter and a number.' });
        }

        const existingUser = await findUserByEmail(email);
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await createUser(username, email, hashedPassword);

        const verificationToken = await setVerificationToken(newUser.id);
        const verifyUrl = `${FRONTEND}/verify-email/${verificationToken}`;
        sendMail({
            to: email,
            subject: 'StreetLens — Verify your email',
            text: `Welcome to StreetLens! Please verify your email:\n\n${verifyUrl}`,
            html: `<p>Welcome to StreetLens!</p><p><a href="${verifyUrl}">Verify your email address</a></p>`,
        }).catch(err => logger.error(`Verification email failed: ${err.message}`));

        const token = jwt.sign({ id: newUser.id, role: newUser.role }, process.env.JWT_SECRET, { expiresIn: '7d' });

        sendCapiEvent({
            eventName: 'CompleteRegistration',
            sourceUrl: `${FRONTEND}/register`,
            eventId: req.body.eventId || undefined,
            userData: { email },
            req,
        }).catch(err => logger.error(`CAPI CompleteRegistration failed: ${err.message}`));

        res.status(201).json({
            user: { id: newUser.id, username: newUser.username, email: newUser.email, role: newUser.role, email_verified: false },
            token,
        });
    } catch (err) {
        logger.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

const login = async (req, res) => {
    try {
        const {email, password} = req.body;

        //find user

        const user = await findUserByEmail(email);
        if(!user) return res.status(400).json({message: "Invalid credentials"});

        //compare password

        const isMatch = await bcrypt.compare(password, user.password_hash);
        if(!isMatch) return res.status(400).json({message: 'Invalid credentials'});

        //create JWT token

        const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
            expiresIn: '7d',
        });

        res.json({ user: { id: user.id, username: user.username, email: user.email, role: user.role, email_verified: user.email_verified }, token });

    } catch(err) {

        res.status(500).json({message: 'Server error'});
    }

}

const resetPassword = async (req, res) => {
    try {
        const userId = req.user.id;
        const { oldPassword, newPassword } = req.body;
        if (!oldPassword || !newPassword) {
            return res.status(400).json({ message: 'Old and new password required.' });
        }
        if (!isStrongPassword(newPassword)) {
            return res.status(400).json({ message: 'Password must be at least 8 characters and include a letter and a number.' });
        }
        // Find user
        const user = await findUserById(userId);
        if (!user) return res.status(404).json({ message: 'User not found.' });
        // Get full user (with password_hash)
        const fullUser = await findUserByEmail(user.email);
        const isMatch = await bcrypt.compare(oldPassword, fullUser.password_hash);
        if (!isMatch) return res.status(400).json({ message: 'Old password is incorrect.' });
        // Hash new password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
        // Update password in DB
        await updateUserPassword(userId, hashedPassword);
        res.json({ message: 'Password updated successfully.' });
    } catch (err) {

        res.status(500).json({ message: 'Server error' });
    }
};


const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) return res.status(400).json({ message: 'Email is required.' });

        const token = await setResetToken(email);

        if (token) {
            const resetUrl = `${FRONTEND}/reset-password/${token}`;
            try {
                await sendMail({
                    from: process.env.CONTACT_EMAIL || process.env.MAILTRAP_USER,
                    to: email,
                    subject: 'StreetLens — Reset your password',
                    text: `You requested a password reset.\n\nClick the link below to set a new password (valid for 1 hour):\n\n${resetUrl}\n\nIf you did not request this, you can safely ignore this email.`,
                    html: `<p>You requested a password reset.</p><p><a href="${resetUrl}">Reset your password</a></p><p>This link expires in 1 hour. If you did not request this, ignore this email.</p>`,
                });
            } catch (mailErr) {
                logger.error(`Forgot-password email failed: ${mailErr.message}`);
            }
        }

        // Always return the same message to prevent email enumeration
        res.json({ message: 'If that email is registered, a reset link has been sent.' });
    } catch (err) {
        logger.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

const resetPasswordByToken = async (req, res) => {
    try {
        const { token } = req.params;
        const { newPassword } = req.body;

        if (!newPassword || newPassword.length < 8) {
            return res.status(400).json({ message: 'Password must be at least 8 characters.' });
        }

        const user = await findUserByResetToken(token);
        if (!user) {
            return res.status(400).json({ message: 'Reset link is invalid or has expired.' });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await updateUserPassword(user.id, hashedPassword);
        await clearResetToken(user.id);

        res.json({ message: 'Password reset successfully. You can now log in.' });
    } catch (err) {
        logger.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

const verifyEmail = async (req, res) => {
    try {
        const { token } = req.params;
        const user = await verifyEmailToken(token);
        if (!user) {
            return res.status(400).json({ message: 'Invalid or already used verification link.' });
        }
        sendMail({
            to: user.email,
            subject: 'Welcome to StreetLens',
            text: `Hi ${user.username},\n\nYour email is confirmed. You can now submit reports, know your rights, and hold landlords accountable.\n\nWelcome to StreetLens.\n\n${FRONTEND}`,
            html: `<p>Hi ${user.username},</p><p>Your email is confirmed. You can now submit reports, know your rights, and hold landlords accountable.</p><p>Welcome to StreetLens.</p><p><a href="${FRONTEND}">Go to StreetLens</a></p>`,
        }).catch(err => logger.error(`Welcome email failed: ${err.message}`));
        res.json({ message: 'Email verified successfully.' });
    } catch (err) {
        logger.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

const getMe = async (req, res) => {
    try {
        const user = await findUserById(req.user.id);
        if (!user) return res.status(404).json({ message: 'User not found.' });
        const full = await findUserByEmail(user.email);
        res.json({ id: full.id, username: full.username, email: full.email, role: full.role, email_verified: full.email_verified });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    register,
    login,
    resetPassword,
    forgotPassword,
    resetPasswordByToken,
    verifyEmail,
    getMe,
};