const {
  createComment,
  getCommentsByReportId,
  deleteComment
} = require('../models/commentModel');

const createReportComment = async (req, res) => {
  try {
    const { reportId } = req.params;
    const { content, isAnonymous, parent_comment_id } = req.body;

    if (!content) {
      return res.status(400).json({ message: 'Comment content is required' });
    }

    const comment = await createComment({
      user_id: req.user.id,
      report_id: reportId,
      content,
      is_anonymous: isAnonymous,
      parent_comment_id: parent_comment_id || null
    });

    res.status(201).json(comment);
  } catch (error) {

    res.status(500).json({ message: 'Failed to create comment' });
  }
};

const getReportComments = async (req, res) => {
  try {
    const { reportId } = req.params;
    const comments = await getCommentsByReportId(reportId);
    res.json(comments);
  } catch (error) {

    res.status(500).json({ message: 'Failed to fetch comments' });
  }
};



const deleteReportComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const deleted = await deleteComment(commentId, req.user.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Comment not found or not authorized' });
    }
    res.json({ message: 'Comment deleted' });
  } catch (error) {

    res.status(500).json({ message: 'Failed to delete comment' });
  }
};

module.exports = {
  createReportComment,
  getReportComments,
  deleteReportComment
};
