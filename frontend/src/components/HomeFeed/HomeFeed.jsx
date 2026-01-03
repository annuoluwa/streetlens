import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchReports } from '../../report/reportSlice';

const HomeFeed = () => {
	const dispatch = useDispatch();
	const { reports, loading, error } = useSelector((state) => state.reports);

	useEffect(() => {
		dispatch(fetchReports());
	}, [dispatch]);

	return (
		<div className="home-feed-container">
			<h2>Latest Reports</h2>
			{loading && <div>Loading reports...</div>}
			{error && <div className="error">{error}</div>}
			{!loading && !error && reports.length === 0 && <div>No reports available.</div>}
			<div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
				{reports.map((report) => (
					<div key={report.id || report._id} style={{ border: '1px solid #ddd', borderRadius: 8, padding: 16, background: '#fafafa' }}>
						<h3 style={{ margin: 0 }}>{report.title}</h3>
						<p style={{ margin: '0.5rem 0' }}>{report.description}</p>
						<div style={{ fontSize: 14, color: '#555' }}>
							<span><strong>Location:</strong> {report.location}</span> |{' '}
							<span><strong>Date:</strong> {report.createdAt ? new Date(report.createdAt).toLocaleString() : 'N/A'}</span>
						</div>
					</div>
				))}
			</div>
		</div>
	);
};

export default HomeFeed;
