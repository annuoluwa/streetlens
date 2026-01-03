import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchReports } from '../../report/reportSlice';

const AreaOverview = () => {
	const dispatch = useDispatch();
	const { reports, loading, error } = useSelector((state) => state.reports);

	useEffect(() => {
		dispatch(fetchReports());
	}, [dispatch]);

	return (
		<div className="area-overview-container">
			<h2>Area Overview</h2>
			{loading && <div>Loading reports...</div>}
			{error && <div className="error">{error}</div>}
			{!loading && !error && reports.length === 0 && <div>No reports found for this area.</div>}
			<ul>
				{reports.map((report) => (
					<li key={report.id || report._id} style={{ marginBottom: '1rem', borderBottom: '1px solid #ccc', paddingBottom: '0.5rem' }}>
						<strong>{report.title}</strong>
						<div>{report.description}</div>
						<div><em>Location:</em> {report.location}</div>
						<div><em>Date:</em> {report.createdAt ? new Date(report.createdAt).toLocaleString() : 'N/A'}</div>
					</li>
				))}
			</ul>
		</div>
	);
};

export default AreaOverview;
