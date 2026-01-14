jest.mock('../models/commentModel', () => ({
  createComment: jest.fn(),
  getCommentsByReportId: jest.fn(),
  deleteComment: jest.fn(),
}));

const {
  createComment,
  getCommentsByReportId,
  deleteComment,
} = require('../models/commentModel');

const {
  createReportComment,
  getReportComments,
  deleteReportComment,
} = require('../controllers/commentController');

const makeRes = () => ({
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
});

beforeEach(() => {
  jest.clearAllMocks();
});

describe('commentController', () => {
  // Create comment
  describe('createReportComment', () => {
    test('returns 400 if content is missing', async () => {
      const req = {
        params: { reportId: '10' },
        body: { content: '' },
        user: { id: 1 },
      };
      const res = makeRes();

      await createReportComment(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Comment content is required' });
      expect(createComment).not.toHaveBeenCalled();
    });

    test('creates a comment without parent', async () => {
      const created = { id: 1, content: 'Hello' };
      createComment.mockResolvedValueOnce(created);

      const req = {
        params: { reportId: '10' },
        body: { content: 'Hello', isAnonymous: false },
        user: { id: 1 },
      };
      const res = makeRes();

      await createReportComment(req, res);

      expect(createComment).toHaveBeenCalledWith({
        user_id: 1,
        report_id: '10',
        content: 'Hello',
        is_anonymous: false,
        parent_comment_id: null,
      });

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(created);
    });

    test('creates a reply comment', async () => {
      const created = { id: 2, content: 'Reply', parent_comment_id: 5 };
      createComment.mockResolvedValueOnce(created);

      const req = {
        params: { reportId: '10' },
        body: { content: 'Reply', isAnonymous: true, parent_comment_id: 5 },
        user: { id: 1 },
      };
      const res = makeRes();

      await createReportComment(req, res);

      expect(createComment).toHaveBeenCalledWith({
        user_id: 1,
        report_id: '10',
        content: 'Reply',
        is_anonymous: true,
        parent_comment_id: 5,
      });

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(created);
    });

    test('returns 500 on error', async () => {
      createComment.mockRejectedValueOnce(new Error('db error'));

      const req = {
        params: { reportId: '10' },
        body: { content: 'Hello' },
        user: { id: 1 },
      };
      const res = makeRes();

      await createReportComment(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Failed to create comment' });
    });
  });

  // Get comments
  describe('getReportComments', () => {
    test('returns comments for a report', async () => {
      const comments = [{ id: 1 }, { id: 2 }];
      getCommentsByReportId.mockResolvedValueOnce(comments);

      const req = { params: { reportId: '10' } };
      const res = makeRes();

      await getReportComments(req, res);

      expect(getCommentsByReportId).toHaveBeenCalledWith('10');
      expect(res.json).toHaveBeenCalledWith(comments);
    });

    test('returns 500 on error', async () => {
      getCommentsByReportId.mockRejectedValueOnce(new Error('db error'));

      const req = { params: { reportId: '10' } };
      const res = makeRes();

      await getReportComments(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Failed to fetch comments' });
    });
  });

  // Delete comment
  describe('deleteReportComment', () => {
    test('returns 404 if not found or unauthorized', async () => {
      deleteComment.mockResolvedValueOnce(false);

      const req = {
        params: { commentId: '99' },
        user: { id: 1 },
      };
      const res = makeRes();

      await deleteReportComment(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Comment not found or not authorized',
      });
    });

    test('deletes comment successfully', async () => {
      deleteComment.mockResolvedValueOnce(true);

      const req = {
        params: { commentId: '10' },
        user: { id: 1 },
      };
      const res = makeRes();

      await deleteReportComment(req, res);

      expect(deleteComment).toHaveBeenCalledWith('10', 1);
      expect(res.json).toHaveBeenCalledWith({ message: 'Comment deleted' });
    });

    test('returns 500 on error', async () => {
      deleteComment.mockRejectedValueOnce(new Error('db error'));

      const req = {
        params: { commentId: '10' },
        user: { id: 1 },
      };
      const res = makeRes();

      await deleteReportComment(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Failed to delete comment',
      });
    });
  });
});
