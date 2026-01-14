const pool = require('../db/db');
const jwt = require('jsonwebtoken');

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

module.exports = {
    createUser,
    findUserByEmail,
    findUserById,
    registerUser,
    deleteUserById,
    updateUserPassword
};