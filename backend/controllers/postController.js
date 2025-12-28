const db = require('../db/db');

const createPost = async (req, res) => {
  try {
    const { content, isAnonymous } = req.body;

    if (!content) {
      return res.status(400).json({ message: 'Post content is required' });
    }

    const result = await db.query(
      `INSERT INTO posts (content, user_id, is_anonymous)
       VALUES ($1, $2, $3)
       RETURNING id, content, is_anonymous, created_at`,
      [content, req.user.id, isAnonymous]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to create post' });
  }
};

module.exports ={createPost};