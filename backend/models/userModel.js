const pool = require('../db/db');
const jwt = require('jsonwebtoken');

const createUser = async (username, email, hashedPassword) => {
    const query = 'INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING id, username, email';
    const values = [username, email, hashedPassword];
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

const registerUser = async (username, email, password) => {
    // Check if the user already exists
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
        throw new Error('User already exists');
    }

    // Here you would hash the password, for now, we will skip this step
    const hashedPassword = password; // TODO: Replace this with actual hashing

    // Create the new user
    const newUser = await createUser(username, email, hashedPassword);

    // Generate a JWT token for the new user
    const token = jwt.sign({ id: newUser.id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    return { user: newUser, token };
};

// Delete user by id
const deleteUserById = async (id) => {
    const result = await pool.query('DELETE FROM users WHERE id = $1 RETURNING id, username, email', [id]);
    return result.rows[0];
};

module.exports = {
    createUser,
    findUserByEmail,
    findUserById,
    registerUser,
    deleteUserById
};