const db = require('../db/db');

const createComment = async (req, res) => {
  try {
    const { content, postId, isAnonymous } = req.body;

    if (!content || !postId) {
      return res.status(400).json({ message: 'Content and postId are required' });
    }

    const result = await db.query(
      `INSERT INTO comments (content, post_id, user_id, is_anonymous)
       VALUES ($1, $2, $3, $4)
       RETURNING id, content, is_anonymous, created_at`,
      [content, postId, req.user.id, isAnonymous]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to create comment' });
  }
};

module.exports ={createComment};
