jest.mock('../db/db', () => ({
  query: jest.fn(),
}));

jest.mock('../models/reportModel', () => ({
  getFilteredReports: jest.fn(),
  getReportById: jest.fn(),
  verifyReportStatus: jest.fn(),
  countRecentReports: jest.fn(),
  flagRecentReports: jest.fn(),
  resetEscalationThreshold: jest.fn(),
}));

jest.mock('../utils/adminNotify', () => ({
  sendAdminFlaggedNotification: jest.fn(),
}));

jest.mock('../utils/getAuthorityForReport', () => jest.fn());
jest.mock('../utils/sendToAuthority', () => jest.fn());

const pool = require('../db/db');
const reportModel = require('../models/reportModel');
const { sendAdminFlaggedNotification } = require('../utils/adminNotify');
const getAuthorityForReport = require('../utils/getAuthorityForReport');
const sendToAuthority = require('../utils/sendToAuthority');

const {
  createReport,
  deleteReport,
  getReports,
  getReportById,
  verifyReport,
} = require('../controllers/reportController');

const makeRes = () => ({
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
});

beforeEach(() => {
  jest.clearAllMocks();
});

describe('reportController', () => {
  describe('createReport', () => {
    test('401 if not authenticated', async () => {
      const req = { user: null, body: {}, files: [] };
      const res = makeRes();

      await createReport(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Authentication required to submit a report',
      });
      expect(pool.query).not.toHaveBeenCalled();
    });

    test('400 if required fields missing', async () => {
      const req = {
        user: { id: 1 },
        body: { title: 'T', description: 'D', street: 'S' },
        files: [],
      };
      const res = makeRes();

      await createReport(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Title, description, street, and postcode are required',
      });
      expect(pool.query).not.toHaveBeenCalled();
    });

    test('201 creates report (no evidence) when valid', async () => {
      const inserted = {
        id: 1,
        postcode: 'E1 1AA',
        street: 'Test Street',
        flat_number: null,
      };

      pool.query.mockResolvedValueOnce({ rows: [inserted] }); // INSERT reports
      reportModel.countRecentReports.mockResolvedValueOnce(1); // below threshold

      const req = {
        user: { id: 10 },
        body: {
          title: 'Leak',
          description: 'Pipe leaking',
          street: 'Test Street',
          postcode: 'E1 1AA',
          is_anonymous: 'true',
          flagged: 'false',
        },
        files: [],
      };
      const res = makeRes();

      await createReport(req, res);

      expect(pool.query).toHaveBeenCalledTimes(1);
      expect(reportModel.countRecentReports).toHaveBeenCalledWith({
        postcode: inserted.postcode,
        street: inserted.street,
        flat_number: inserted.flat_number,
      });

      expect(reportModel.flagRecentReports).not.toHaveBeenCalled();
      expect(sendAdminFlaggedNotification).not.toHaveBeenCalled();

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(inserted);
    });

    test('inserts evidence files when provided', async () => {
      const inserted = {
        id: 2,
        postcode: 'AB1 2CD',
        street: 'High Street',
        flat_number: null,
      };

      pool.query
        .mockResolvedValueOnce({ rows: [inserted] }) // INSERT reports
        .mockResolvedValueOnce({ rows: [] }) // INSERT evidence 1
        .mockResolvedValueOnce({ rows: [] }); // INSERT evidence 2

      reportModel.countRecentReports.mockResolvedValueOnce(1);

      const req = {
        user: { id: 10 },
        body: {
          title: 'Mould',
          description: 'Black mould',
          street: 'High Street',
          postcode: 'AB1 2CD',
        },
        files: [{ filename: 'a.png' }, { filename: 'b.jpg' }],
      };
      const res = makeRes();

      await createReport(req, res);

      expect(pool.query).toHaveBeenCalledWith(
        'INSERT INTO evidence_files (report_id, file_name) VALUES ($1, $2)',
        [2, 'a.png']
      );
      expect(pool.query).toHaveBeenCalledWith(
        'INSERT INTO evidence_files (report_id, file_name) VALUES ($1, $2)',
        [2, 'b.jpg']
      );

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(inserted);
    });

    test('flags + notifies admin when count >= 3', async () => {
      const inserted = {
        id: 3,
        postcode: 'ZZ1 9ZZ',
        street: 'Flag St',
        flat_number: '1A',
      };

      pool.query.mockResolvedValueOnce({ rows: [inserted] });
      reportModel.countRecentReports.mockResolvedValueOnce(3);
      reportModel.flagRecentReports.mockResolvedValueOnce(undefined);
      sendAdminFlaggedNotification.mockResolvedValueOnce(undefined);

      const req = {
        user: { id: 10 },
        body: {
          title: 'Hazard',
          description: 'Unsafe wiring',
          street: 'Flag St',
          postcode: 'ZZ1 9ZZ',
          flat_number: '1A',
        },
        files: [],
      };
      const res = makeRes();

      await createReport(req, res);

      expect(reportModel.flagRecentReports).toHaveBeenCalledWith({
        postcode: inserted.postcode,
        street: inserted.street,
        flat_number: inserted.flat_number,
      });

      expect(sendAdminFlaggedNotification).toHaveBeenCalledWith({
        postcode: inserted.postcode,
        street: inserted.street,
        flat_number: inserted.flat_number,
        count: 3,
      });

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(inserted);
    });

    test('still 201 even if admin notify throws', async () => {
      const inserted = {
        id: 4,
        postcode: 'YY1 1YY',
        street: 'Notify Fail St',
        flat_number: null,
      };

      pool.query.mockResolvedValueOnce({ rows: [inserted] });
      reportModel.countRecentReports.mockResolvedValueOnce(4);
      reportModel.flagRecentReports.mockResolvedValueOnce(undefined);
      sendAdminFlaggedNotification.mockRejectedValueOnce(new Error('smtp down'));

      const req = {
        user: { id: 10 },
        body: {
          title: 'Issue',
          description: 'Something',
          street: 'Notify Fail St',
          postcode: 'YY1 1YY',
        },
        files: [],
      };
      const res = makeRes();

      await createReport(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(inserted);
    });

    test('500 if db fails', async () => {
      pool.query.mockRejectedValueOnce(new Error('db down'));

      const req = {
        user: { id: 10 },
        body: {
          title: 'Leak',
          description: 'Pipe leaking',
          street: 'Test Street',
          postcode: 'E1 1AA',
        },
        files: [],
      };
      const res = makeRes();

      await createReport(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Failed to create report',
          error: 'db down',
        })
      );
    });
  });

  describe('deleteReport', () => {
    test('401 if not authenticated', async () => {
      const req = { user: null, params: { id: '1' } };
      const res = makeRes();

      await deleteReport(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: 'Authentication required' });
    });

    test('404 if report not found', async () => {
      pool.query.mockResolvedValueOnce({ rows: [] });

      const req = { user: { id: 1 }, params: { id: '123' } };
      const res = makeRes();

      await deleteReport(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Report not found' });
    });

    test('403 if not owner and not admin', async () => {
      pool.query.mockResolvedValueOnce({ rows: [{ user_id: 999 }] });

      const req = { user: { id: 1, role: 'user' }, params: { id: '50' } };
      const res = makeRes();

      await deleteReport(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
    });

    test('200 if owner deletes (deletes evidence then report)', async () => {
      pool.query
        .mockResolvedValueOnce({ rows: [{ user_id: 1 }] }) // select owner
        .mockResolvedValueOnce({ rows: [] }) // delete evidence
        .mockResolvedValueOnce({ rows: [] }); // delete report

      const req = { user: { id: 1, role: 'user' }, params: { id: '77' } };
      const res = makeRes();

      await deleteReport(req, res);

      expect(pool.query).toHaveBeenCalledWith('DELETE FROM evidence_files WHERE report_id = $1', ['77']);
      expect(pool.query).toHaveBeenCalledWith('DELETE FROM reports WHERE id = $1', ['77']);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Report deleted successfully' });
    });

    test('200 if admin deletes', async () => {
      pool.query
        .mockResolvedValueOnce({ rows: [{ user_id: 555 }] })
        .mockResolvedValueOnce({ rows: [] })
        .mockResolvedValueOnce({ rows: [] });

      const req = { user: { id: 1, role: 'admin' }, params: { id: '88' } };
      const res = makeRes();

      await deleteReport(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
    });
  });

  describe('getReports', () => {
    test('returns paginated response', async () => {
      reportModel.getFilteredReports.mockResolvedValueOnce([{ id: 1 }, { id: 2 }]);
      pool.query.mockResolvedValueOnce({ rows: [{ count: '12' }] });

      const req = {
        query: {
          search: 'mould',
          city: 'London',
          category: 'Health Hazard',
          admin_flagged: 'true',
          page: '2',
          limit: '5',
        },
      };
      const res = makeRes();

      await getReports(req, res);

      expect(res.json).toHaveBeenCalledWith({
        page: 2,
        limit: 5,
        total: 12,
        totalPages: Math.ceil(12 / 5),
        data: [{ id: 1 }, { id: 2 }],
      });
    });
  });

  describe('getReportById', () => {
    test('404 if not found', async () => {
      reportModel.getReportById.mockResolvedValueOnce(null);

      const req = { params: { id: '1' } };
      const res = makeRes();

      await getReportById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Report not found' });
    });

    test('200 returns report and evidence_files', async () => {
      reportModel.getReportById.mockResolvedValueOnce({ id: 10, title: 'Test' });

      pool.query.mockResolvedValueOnce({
        rows: [{ file_name: 'a.png' }, { file_name: 'b.jpg' }],
      });

      const req = { params: { id: '10' } };
      const res = makeRes();

      await getReportById(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        id: 10,
        title: 'Test',
        evidence_files: ['a.png', 'b.jpg'],
      });
    });
  });

  describe('verifyReport', () => {
    test('400 if invalid status', async () => {
      const req = {
        params: { id: '1' },
        body: { status: 'maybe' },
        user: { role: 'admin' },
      };
      const res = makeRes();

      await verifyReport(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
    });

    test('403 if not admin', async () => {
      const req = {
        params: { id: '1' },
        body: { status: 'approved' },
        user: { role: 'user' },
      };
      const res = makeRes();

      await verifyReport(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
    });

    test('approved: routes, sends, resets threshold, verifies', async () => {
      const report = {
        id: '55',
        postcode: 'AA1 1AA',
        street: 'Route St',
        flat_number: '1C',
      };

      reportModel.getReportById.mockResolvedValueOnce(report);
      getAuthorityForReport.mockReturnValueOnce({ name: 'Test Council', email: 'x@test.com' });
      sendToAuthority.mockResolvedValueOnce(undefined);
      reportModel.resetEscalationThreshold.mockResolvedValueOnce(undefined);
      reportModel.verifyReportStatus.mockResolvedValueOnce({ id: '55' });

      const req = {
        params: { id: '55' },
        body: { status: 'approved' },
        user: { role: 'admin', id: 1 },
      };
      const res = makeRes();

      await verifyReport(req, res);

      expect(sendToAuthority).toHaveBeenCalled();
      expect(reportModel.resetEscalationThreshold).toHaveBeenCalledWith({
        postcode: report.postcode,
        street: report.street,
        flat_number: report.flat_number,
      });
      expect(reportModel.verifyReportStatus).toHaveBeenCalledWith('55', true);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Report approved',
        routedTo: { name: 'Test Council', email: 'x@test.com' },
      });
    });

    test('rejected: verifies false, no routing', async () => {
      reportModel.verifyReportStatus.mockResolvedValueOnce({ id: '10' });

      const req = {
        params: { id: '10' },
        body: { status: 'rejected' },
        user: { role: 'admin' },
      };
      const res = makeRes();

      await verifyReport(req, res);

      expect(sendToAuthority).not.toHaveBeenCalled();
      expect(reportModel.verifyReportStatus).toHaveBeenCalledWith('10', false);
      expect(res.status).toHaveBeenCalledWith(200);
    });
  });
});
