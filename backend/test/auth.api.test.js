/* backend/test/auth.api.test.js */

jest.mock('bcrypt', () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));

jest.mock('jsonwebtoken', () => ({
  sign: jest.fn(),
}));

jest.mock('../models/userModel', () => ({
  createUser: jest.fn(),
  findUserByEmail: jest.fn(),
  findUserById: jest.fn(),
  updateUserPassword: jest.fn(),
}));

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {
  createUser,
  findUserByEmail,
  findUserById,
  updateUserPassword,
} = require('../models/userModel');

const { register, login, resetPassword } = require('../controllers/authController');

const makeRes = () => ({
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
});

describe('authController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.JWT_SECRET = 'test_secret';
  });

  // REGISTER
  describe('register', () => {
    test('400 if user already exists', async () => {
      findUserByEmail.mockResolvedValueOnce({ id: 1 });

      const req = { body: { username: 'Liz', email: 'liz@test.com', password: 'pass' } };
      const res = makeRes();

      await register(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'User already exists' });
      expect(bcrypt.hash).not.toHaveBeenCalled();
      expect(createUser).not.toHaveBeenCalled();
      expect(jwt.sign).not.toHaveBeenCalled();
    });

    test('201 creates user, hashes password, returns token', async () => {
      findUserByEmail.mockResolvedValueOnce(null);
      bcrypt.hash.mockResolvedValueOnce('hashed_pw');

      const newUser = { id: 10, username: 'Liz', email: 'liz@test.com', role: 'user' };
      createUser.mockResolvedValueOnce(newUser);

      jwt.sign.mockReturnValueOnce('jwt_token');

      const req = { body: { username: 'Liz', email: 'liz@test.com', password: 'pass' } };
      const res = makeRes();

      await register(req, res);

      expect(bcrypt.hash).toHaveBeenCalledWith('pass', 10);
      expect(createUser).toHaveBeenCalledWith('Liz', 'liz@test.com', 'hashed_pw');
      expect(jwt.sign).toHaveBeenCalledWith(
        { id: 10, role: 'user' },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        user: { id: 10, username: 'Liz', email: 'liz@test.com', role: 'user' },
        token: 'jwt_token',
      });
    });

    test('500 on server error', async () => {
      findUserByEmail.mockRejectedValueOnce(new Error('boom'));

      const req = { body: { username: 'Liz', email: 'liz@test.com', password: 'pass' } };
      const res = makeRes();

      await register(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Server error' });
    });
  });

  // LOGIN
  describe('login', () => {
    test('400 if user not found', async () => {
      findUserByEmail.mockResolvedValueOnce(null);

      const req = { body: { email: 'x@test.com', password: 'pass' } };
      const res = makeRes();

      await login(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Invalid credentials' });
      expect(bcrypt.compare).not.toHaveBeenCalled();
      expect(jwt.sign).not.toHaveBeenCalled();
    });

    test('400 if password does not match', async () => {
      findUserByEmail.mockResolvedValueOnce({
        id: 1,
        username: 'Liz',
        email: 'liz@test.com',
        role: 'user',
        password_hash: 'hash',
      });

      bcrypt.compare.mockResolvedValueOnce(false);

      const req = { body: { email: 'liz@test.com', password: 'wrong' } };
      const res = makeRes();

      await login(req, res);

      expect(bcrypt.compare).toHaveBeenCalledWith('wrong', 'hash');
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Invalid credentials' });
      expect(jwt.sign).not.toHaveBeenCalled();
    });

    test('200 returns user + token if credentials valid', async () => {
      const user = {
        id: 2,
        username: 'Liz',
        email: 'liz@test.com',
        role: 'user',
        password_hash: 'hash',
      };

      findUserByEmail.mockResolvedValueOnce(user);
      bcrypt.compare.mockResolvedValueOnce(true);
      jwt.sign.mockReturnValueOnce('jwt_token');

      const req = { body: { email: 'liz@test.com', password: 'pass' } };
      const res = makeRes();

      await login(req, res);

      expect(jwt.sign).toHaveBeenCalledWith(
        { id: 2, role: 'user' },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      expect(res.json).toHaveBeenCalledWith({
        user: { id: 2, username: 'Liz', email: 'liz@test.com', role: 'user' },
        token: 'jwt_token',
      });
    });

    test('500 on server error', async () => {
      findUserByEmail.mockRejectedValueOnce(new Error('db down'));

      const req = { body: { email: 'liz@test.com', password: 'pass' } };
      const res = makeRes();

      await login(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Server error' });
    });
  });

  // RESET PASSWORD
  describe('resetPassword', () => {
    test('400 if old/new password missing', async () => {
      const req = { user: { id: 1 }, body: { oldPassword: '', newPassword: '' } };
      const res = makeRes();

      await resetPassword(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Old and new password required.' });
    });

    test('404 if user not found', async () => {
      findUserById.mockResolvedValueOnce(null);

      const req = { user: { id: 1 }, body: { oldPassword: 'a', newPassword: 'b' } };
      const res = makeRes();

      await resetPassword(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'User not found.' });
    });

    test('400 if old password incorrect', async () => {
      findUserById.mockResolvedValueOnce({ id: 1, email: 'liz@test.com' });
      findUserByEmail.mockResolvedValueOnce({ email: 'liz@test.com', password_hash: 'hash' });
      bcrypt.compare.mockResolvedValueOnce(false);

      const req = { user: { id: 1 }, body: { oldPassword: 'wrong', newPassword: 'new' } };
      const res = makeRes();

      await resetPassword(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Old password is incorrect.' });
      expect(updateUserPassword).not.toHaveBeenCalled();
    });

    test('200 updates password if old password matches', async () => {
      findUserById.mockResolvedValueOnce({ id: 1, email: 'liz@test.com' });
      findUserByEmail.mockResolvedValueOnce({ email: 'liz@test.com', password_hash: 'oldhash' });
      bcrypt.compare.mockResolvedValueOnce(true);
      bcrypt.hash.mockResolvedValueOnce('newhash');
      updateUserPassword.mockResolvedValueOnce();

      const req = { user: { id: 1 }, body: { oldPassword: 'old', newPassword: 'new' } };
      const res = makeRes();

      await resetPassword(req, res);

      expect(bcrypt.hash).toHaveBeenCalledWith('new', 10);
      expect(updateUserPassword).toHaveBeenCalledWith(1, 'newhash');

      expect(res.json).toHaveBeenCalledWith({ message: 'Password updated successfully.' });
    });

    test('500 on server error', async () => {
      findUserById.mockRejectedValueOnce(new Error('boom'));

      const req = { user: { id: 1 }, body: { oldPassword: 'old', newPassword: 'new' } };
      const res = makeRes();

      await resetPassword(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Server error' });
    });
  });
});
