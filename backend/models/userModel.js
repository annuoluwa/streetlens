const pool = require('../db/db');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const createUser = async (username, email, hashedPassword, role = 'user') => {
    const query = 'INSERT INTO users (username, email, password_hash, role) VALUES ($1, $2, $3, $4) RETURNING id, username, email, role';
    const values = [username, email, hashedPassword, role];
    const result = await pool.query(query, values);
    return result.rows[0];
};

//find user by email

const findUserByEmail = async (email) => {
    const query = 'SELECT * FROM users WHERE email = $1';
    const result = await pool.query(query, [email]);
    return result.rows[0];
}


//find user by id

const findUserById = async (id) => {
    const query = 'SELECT id, username, email FROM users WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0];
}

const registerUser = async (username, email, password, role = 'user') => {
    // Check if the user already exists
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
        throw new Error('User already exists');
    }

    // Password should be hashed before calling this function.
    const hashedPassword = password;

    // Create the new user
    const newUser = await createUser(username, email, hashedPassword, role);
    const token = jwt.sign({ id: newUser.id, role: newUser.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
    return { user: newUser, token };
};

// Delete user by id
const deleteUserById = async (id) => {
    const result = await pool.query('DELETE FROM users WHERE id = $1 RETURNING id, username, email', [id]);
    return result.rows[0];
};

const updateUserPassword = async (id, hashedPassword) => {
    const result = await pool.query('UPDATE users SET password_hash = $1 WHERE id = $2 RETURNING id', [hashedPassword, id]);
    return result.rows[0];
};

const setVerificationToken = async (userId) => {
    const token = crypto.randomBytes(32).toString('hex');
    await pool.query(
        'UPDATE users SET email_verification_token = $1 WHERE id = $2',
        [token, userId]
    );
    return token;
};

const verifyEmailToken = async (token) => {
    const result = await pool.query(
        'UPDATE users SET email_verified = TRUE, email_verification_token = NULL WHERE email_verification_token = $1 RETURNING id, username, email',
        [token]
    );
    return result.rows[0] || null;
};

const setResetToken = async (email) => {
    const token = crypto.randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
    const result = await pool.query(
        'UPDATE users SET reset_token = $1, reset_token_expires = $2 WHERE email = $3 RETURNING id',
        [token, expires, email]
    );
    return result.rowCount > 0 ? token : null;
};

const findUserByResetToken = async (token) => {
    const result = await pool.query(
        'SELECT * FROM users WHERE reset_token = $1 AND reset_token_expires > NOW()',
        [token]
    );
    return result.rows[0];
};

const clearResetToken = async (userId) => {
    await pool.query(
        'UPDATE users SET reset_token = NULL, reset_token_expires = NULL WHERE id = $1',
        [userId]
    );
};

module.exports = {
    createUser,
    findUserByEmail,
    findUserById,
    registerUser,
    deleteUserById,
    updateUserPassword,
    setResetToken,
    findUserByResetToken,
    clearResetToken,
    setVerificationToken,
    verifyEmailToken,
};