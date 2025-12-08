const pool = require('../db/db');

const createUser = async (username, email, password) => {
    const query = 'INSER INTO user (username, email, password) VALUES ($1, $2, $3) RETURNING id, username, email';

    const values = [username, email, hashedPassword];
    const result = await pool.query(query, values);
    return result.rows[0];
};

//find user by email

const findUserByEmail = async (email) => {
    const query = 'SELECT * FROM user WHERE email = $1';
    const result = await pool.query(query,[email]);
    return result.rows[0];
}


//find user by id

const findUserById = async (id) => {
    const query = 'SELECT id, username, email FROM users WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0];
}

module.exports = {
    createUser,
    findUserByEmail,
    findUserById
};