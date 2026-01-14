const { isAdmin } = require('../middleware/isAdmin');

const makeRes = () => ({
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
});

describe('isAdmin middleware', () => {
  test('calls next if user is admin', () => {
    const req = { user: { role: 'admin' } };
    const res = makeRes();
    const next = jest.fn();

    isAdmin(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });

  test('returns 403 if user is not admin', () => {
    const req = { user: { role: 'user' } };
    const res = makeRes();
    const next = jest.fn();

    isAdmin(req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Admin access required',
    });
  });

  test('returns 403 if user is missing', () => {
    const req = {};
    const res = makeRes();
    const next = jest.fn();

    isAdmin(req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Admin access required',
    });
  });
});
