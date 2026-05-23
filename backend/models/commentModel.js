const pool = require('../db/db');

const createComment = async ({
  user_id,
  report_id,
  content,
  is_anonymous,
  parent_comment_id
}) => {
  const result = await pool.query(
    `
    INSERT INTO comments (user_id, report_id, content, is_anonymous, parent_comment_id)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING id, content, is_anonymous, parent_comment_id, created_at
    `,
    [user_id, report_id, content, is_anonymous, parent_comment_id || null]
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


const getCommentsByReportId = async (report_id, { limit = 20, offset = 0 } = {}) => {
  const countResult = await pool.query(
    `SELECT COUNT(*) FROM comments WHERE report_id = $1 AND parent_comment_id IS NULL`,
    [report_id]
  );
  const total = parseInt(countResult.rows[0].count);

  // Fetch paginated root comments
  const rootResult = await pool.query(
    `
    SELECT id, content, is_anonymous, parent_comment_id, created_at
    FROM comments
    WHERE report_id = $1 AND parent_comment_id IS NULL
    ORDER BY created_at ASC
    LIMIT $2 OFFSET $3
    `,
    [report_id, limit, offset]
  );

  if (rootResult.rows.length === 0) {
    return { total, comments: [] };
  }

  const rootIds = rootResult.rows.map(r => r.id);

  // Fetch all replies for those root comments in one query
  const replyResult = await pool.query(
    `
    SELECT id, content, is_anonymous, parent_comment_id, created_at
    FROM comments
    WHERE report_id = $1 AND parent_comment_id = ANY($2::int[])
    ORDER BY created_at ASC
    `,
    [report_id, rootIds]
  );

  const allRows = [...rootResult.rows, ...replyResult.rows];
  return { total, comments: buildCommentTree(allRows) };
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
