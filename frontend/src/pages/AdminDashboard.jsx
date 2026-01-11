import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AdminDashboard = () => {
  const { user, token } = useSelector((state) => state.user);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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
        const res = await axios.get('http://localhost:8000/api/reports?admin_flagged=true', {
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
    <div style={{ maxWidth: 900, margin: '2rem auto', padding: '2rem', background: '#fff', borderRadius: 10, boxShadow: '0 2px 12px rgba(0,0,0,0.07)' }}>
      <h2 style={{ marginBottom: '1.5rem' }}>Admin Dashboard</h2>
      {loading && <div>Loading flagged reports...</div>}
      {error && <div style={{ color: '#d32f2f' }}>{error}</div>}
      {!loading && reports.length === 0 && <div>No flagged reports found.</div>}
      {!loading && reports.length > 0 && (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f4f6fa' }}>
              <th style={{ padding: '0.7rem', borderBottom: '1px solid #e0e0e0' }}>Title</th>
              <th style={{ padding: '0.7rem', borderBottom: '1px solid #e0e0e0' }}>Street</th>
              <th style={{ padding: '0.7rem', borderBottom: '1px solid #e0e0e0' }}>Postcode</th>
              <th style={{ padding: '0.7rem', borderBottom: '1px solid #e0e0e0' }}>Flagged</th>
              <th style={{ padding: '0.7rem', borderBottom: '1px solid #e0e0e0' }}>Date</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((report) => (
              <tr key={report.id}>
                <td style={{ padding: '0.7rem', borderBottom: '1px solid #f0f0f0' }}>{report.title}</td>
                <td style={{ padding: '0.7rem', borderBottom: '1px solid #f0f0f0' }}>{report.street}</td>
                <td style={{ padding: '0.7rem', borderBottom: '1px solid #f0f0f0' }}>{report.postcode}</td>
                <td style={{ padding: '0.7rem', borderBottom: '1px solid #f0f0f0' }}>{report.admin_flagged ? 'Yes' : 'No'}</td>
                <td style={{ padding: '0.7rem', borderBottom: '1px solid #f0f0f0' }}>{new Date(report.created_at).toLocaleString()}</td>
                <td style={{ padding: '0.7rem', borderBottom: '1px solid #f0f0f0' }}>
                  <button
                    style={{ marginRight: 8, background: '#388e3c', color: '#fff', border: 'none', padding: '0.5rem 1rem', borderRadius: 4, cursor: 'pointer' }}
                    onClick={async () => {
                      try {
                        await axios.post(`http://localhost:8000/api/reports/${report.id}/verify`, { status: 'approved' }, {
                          headers: { Authorization: `Bearer ${token}` },
                        });
                        setReports((prev) => prev.filter((r) => r.id !== report.id));
                      } catch (err) {
                        setError('Failed to approve report');
                      }
                    }}
                  >Approve</button>
                  <button
                    style={{ background: '#d32f2f', color: '#fff', border: 'none', padding: '0.5rem 1rem', borderRadius: 4, cursor: 'pointer' }}
                    onClick={async () => {
                      try {
                        await axios.post(`http://localhost:8000/api/reports/${report.id}/verify`, { status: 'rejected' }, {
                          headers: { Authorization: `Bearer ${token}` },
                        });
                        setReports((prev) => prev.filter((r) => r.id !== report.id));
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
      )}
    </div>
  );
};

export default AdminDashboard;
