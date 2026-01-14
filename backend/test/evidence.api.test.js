jest.mock('../db/db', () => ({
  query: jest.fn(),
}));

const pool = require('../db/db');
const { saveEvidence } = require('../controllers/evidenceController');

const makeRes = () => ({
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
});

beforeEach(() => {
  jest.clearAllMocks();
});

describe('evidenceController', () => {
  // Save evidence
  describe('saveEvidence', () => {
    test('returns 400 if file is missing', async () => {
      const req = {
        params: { reportId: '10' },
        user: { id: 1 },
        file: null,
      };
      const res = makeRes();

      await saveEvidence(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'File is required' });
      expect(pool.query).not.toHaveBeenCalled();
    });

    test('inserts evidence and returns 201', async () => {
      const inserted = {
        id: 1,
        report_id: 10,
        user_id: 1,
        file_name: 'photo.jpg',
        file_type: 'image/jpeg',
        file_size: 12345,
      };

      pool.query.mockResolvedValueOnce({ rows: [inserted] });

      const req = {
        params: { reportId: '10' },
        user: { id: 1 },
        file: {
          filename: 'photo.jpg',
          mimetype: 'image/jpeg',
          size: 12345,
        },
      };
      const res = makeRes();

      await saveEvidence(req, res);

      expect(pool.query).toHaveBeenCalledWith(
        `INSERT INTO evidence_files (report_id, user_id, file_name, file_type, file_size)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
        ['10', 1, 'photo.jpg', 'image/jpeg', 12345]
      );

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(inserted);
    });

    test('returns 500 if database throws', async () => {
      pool.query.mockRejectedValueOnce(new Error('db error'));

      const req = {
        params: { reportId: '10' },
        user: { id: 1 },
        file: {
          filename: 'photo.jpg',
          mimetype: 'image/jpeg',
          size: 12345,
        },
      };
      const res = makeRes();

      await saveEvidence(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Failed to upload evidence',
      });
    });
  });
});
