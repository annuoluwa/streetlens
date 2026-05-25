const pool = require('../db/db');
const logger = require('../logger');

const deleteAccount = async (req, res) => {
  const userId = req.user.id;
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    // Delete user's reports (evidence + comments cascade via FK)
    await client.query('DELETE FROM reports WHERE user_id = $1', [userId]);
    // Delete comments left by user on other reports
    await client.query('DELETE FROM comments WHERE user_id = $1', [userId]);
    // Delete the user
    const result = await client.query(
      'DELETE FROM users WHERE id = $1 RETURNING id',
      [userId]
    );
    if (result.rowCount === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ message: 'User not found' });
    }
    await client.query('COMMIT');
    res.json({ message: 'Account deleted' });
  } catch (err) {
    await client.query('ROLLBACK');
    logger.error(`deleteAccount error for user ${userId}: ${err.message}`);
    res.status(500).json({ message: 'Failed to delete account' });
  } finally {
    client.release();
  }
};

module.exports = { deleteAccount };
