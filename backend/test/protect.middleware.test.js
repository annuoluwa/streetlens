jest.mock('jsonwebtoken', () => ({
  verify: jest.fn(),
}));

const jwt = require('jsonwebtoken');
const { protect } = require('../middleware/protect');

const makeRes = () => ({
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
});

describe('protect middleware', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.JWT_SECRET = 'test_secret';
  });

  test('returns 401 if no authorization header', () => {
    const req = { headers: {} };
    const res = makeRes();
    const next = jest.fn();

    protect(req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Not authorized, no token',
    });
  });

  test('returns 401 if authorization header is malformed', () => {
    const req = {
      headers: { authorization: 'Token abc123' },
    };
    const res = makeRes();
    const next = jest.fn();

    protect(req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Not authorized, no token',
    });
  });

  test('attaches user to req and calls next when token is valid', () => {
    jwt.verify.mockReturnValueOnce({ id: 1, role: 'admin' });

    const req = {
      headers: { authorization: 'Bearer validtoken' },
    };
    const res = makeRes();
    const next = jest.fn();

    protect(req, res, next);

    expect(jwt.verify).toHaveBeenCalledWith('validtoken', 'test_secret');
    expect(req.user).toEqual({ id: 1, role: 'admin' });
    expect(next).toHaveBeenCalled();
  });

  test('returns 401 if token is invalid or expired', () => {
    jwt.verify.mockImplementationOnce(() => {
      throw new Error('invalid token');
    });

    const req = {
      headers: { authorization: 'Bearer badtoken' },
    };
    const res = makeRes();
    const next = jest.fn();

    protect(req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Token invalid or expired',
    });
  });
});
