import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import LogoSpinner from '../components/Spinner/LogoSpinner';

const API_BASE = process.env.REACT_APP_API_URL || window.location.origin;

const AdminDashboard = () => {
  const { user, token } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/');
      return;
    }
    const fetchFlaggedReports = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await axios.get(`${API_BASE}/api/reports?admin_flagged=true`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setReports(res.data.data || []);
      } catch (err) {
        setError('Failed to fetch flagged reports');
      } finally {
        setLoading(false);
      }
    };
    fetchFlaggedReports();
  }, [user, token, navigate]);

  if (!user || user.role !== 'admin') return null;

  return (
    <div className="container my-5">
      <div className="card shadow-sm">
        <div className="card-body">
          <h2 className="card-title mb-4">Admin Dashboard</h2>
          {loading && <LogoSpinner message="Loading flagged reports..." />}
          {error && <div className="alert alert-danger">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}
          {!loading && reports.length === 0 && <div className="alert alert-secondary">No flagged reports found.</div>}
          {!loading && reports.length > 0 && (
            <div className="table-responsive">
              <table className="table table-striped align-middle">
                <thead className="table-light">
                  <tr>
                    <th>Title</th>
                    <th>Street</th>
                    <th>Postcode</th>
                    <th>Flagged</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {reports.map((report) => (
                    <tr key={report.id}>
                      <td>{report.title}</td>
                      <td>{report.street}</td>
                      <td>{report.postcode}</td>
                      <td>{report.admin_flagged ? 'Yes' : 'No'}</td>
                      <td>{new Date(report.created_at).toLocaleString()}</td>
                      <td>
                        <button
                          className="btn btn-success btn-sm me-2"
                          onClick={async () => {
                            try {
                              await axios.post(`${API_BASE}/api/reports/${report.id}/verify`, { status: 'approved' }, {
                                headers: { Authorization: `Bearer ${token}` },
                              });
                              setReports((prev) => prev.filter((r) => r.id !== report.id));
                              setSuccess('Report approved and escalated successfully.');
                              dispatch(require('../report/flaggedReportsSlice').fetchFlaggedReportsCount(token));
                              setTimeout(() => setSuccess(null), 3000);
                            } catch (err) {
                              setError('Failed to approve report');
                            }
                                    {success && <div className="alert alert-success">{success}</div>}
                          }}
                        >Approve</button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={async () => {
                            try {
                              await axios.post(`${API_BASE}/api/reports/${report.id}/verify`, { status: 'rejected' }, {
                                headers: { Authorization: `Bearer ${token}` },
                              });
                              setReports((prev) => prev.filter((r) => r.id !== report.id));
                              setSuccess('Report rejected successfully.');
                              dispatch(require('../report/flaggedReportsSlice').fetchFlaggedReportsCount(token));
                              setTimeout(() => setSuccess(null), 3000);
                            } catch (err) {
                              setError('Failed to reject report');
                            }
                          }}
                        >Reject</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
