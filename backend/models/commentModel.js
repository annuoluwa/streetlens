const pool = require('../db/db');

const createComment = async ({
  user_id,
  report_id,
  content,
  is_anonymous
}) => {
  const result = await pool.query(
    `
    INSERT INTO comments (user_id, report_id, content, is_anonymous)
    VALUES ($1, $2, $3, $4)
    RETURNING id, content, is_anonymous, created_at
    `,
    [user_id, report_id, content, is_anonymous]
  );

  return result.rows[0];
};


const buildCommentTree = (comments) => {
  const map = {};
  const roots = [];

  comments.forEach((c) => {
    c.replies = [];
    map[c.id] = c;
  });

  comments.forEach((c) => {
    if (c.parent_comment_id) {
      const parent = map[c.parent_comment_id];
      if (parent) parent.replies.push(c);
    } else {
      roots.push(c);
    }
  });

  return roots;
};


const getCommentsByReportId = async (report_id) => {
  const result = await pool.query(
    `
    SELECT
      c.id,
      c.content,
      c.is_anonymous,
      parent_comment_id,
      c.created_at
    FROM comments c
    WHERE c.report_id = $1
    ORDER BY c.created_at ASC
    `,
    [report_id]
  );

  return buildCommentTree(result.rows);
};


const deleteComment = async (comment_id, user_id) => {
  const result = await pool.query(
    `DELETE FROM comments WHERE id = $1 AND user_id = $2 RETURNING *`,
    [comment_id, user_id]
  );
  return result.rows[0];
};

module.exports = {
  createComment,
  getCommentsByReportId,
  deleteComment
};
