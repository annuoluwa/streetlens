jest.mock('../models/userModel', () => ({
  deleteUserById: jest.fn(),
}));

const { deleteUserById } = require('../models/userModel');
const { deleteAccount } = require('../controllers/userController');

const makeRes = () => ({
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
});

beforeEach(() => {
  jest.clearAllMocks();
});

describe('userController', () => {
  // Delete account
  describe('deleteAccount', () => {
    test('returns 404 if user not found', async () => {
      deleteUserById.mockResolvedValueOnce(false);

      const req = { user: { id: 1 } };
      const res = makeRes();

      await deleteAccount(req, res);

      expect(deleteUserById).toHaveBeenCalledWith(1);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'User not found' });
    });

    test('deletes user account successfully', async () => {
      deleteUserById.mockResolvedValueOnce(true);

      const req = { user: { id: 1 } };
      const res = makeRes();

      await deleteAccount(req, res);

      expect(deleteUserById).toHaveBeenCalledWith(1);
      expect(res.json).toHaveBeenCalledWith({ message: 'Account deleted' });
    });

    test('returns 500 on server error', async () => {
      deleteUserById.mockRejectedValueOnce(new Error('db error'));

      const req = { user: { id: 1 } };
      const res = makeRes();

      await deleteAccount(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Failed to delete account',
      });
    });
  });
});
