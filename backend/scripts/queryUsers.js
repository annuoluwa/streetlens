// Quick script to query user statistics from Neon DB
// Run with: node scripts/queryUsers.js

require('dotenv').config();
const pool = require('../db/db');

async function queryUsers() {
  try {
    // Total users
    const totalResult = await pool.query('SELECT COUNT(*) as total FROM users');
    console.log('Total users:', totalResult.rows[0].total);

    // New users today
    const todayResult = await pool.query(
      "SELECT COUNT(*) as today FROM users WHERE created_at >= CURRENT_DATE"
    );
    console.log('New users today:', todayResult.rows[0].today);

    // New users this week
    const weekResult = await pool.query(
      "SELECT COUNT(*) as this_week FROM users WHERE created_at >= CURRENT_DATE - INTERVAL '7 days'"
    );
    console.log('New users this week:', weekResult.rows[0].this_week);

    // New users this month
    const monthResult = await pool.query(
      "SELECT COUNT(*) as this_month FROM users WHERE created_at >= CURRENT_DATE - INTERVAL '30 days'"
    );
    console.log('New users this month:', monthResult.rows[0].this_month);

    // List recent users
    const recentResult = await pool.query(
      'SELECT id, username, email, created_at FROM users ORDER BY created_at DESC LIMIT 10'
    );
    console.log('\nRecent users:');
    console.table(recentResult.rows);

  } catch (error) {
    console.error('Error querying users:', error.message);
  } finally {
    await pool.end();
  }
}

queryUsers();
