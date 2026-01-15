import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchReports } from '../../report/reportSlice';
import LogoSpinner from '../Spinner/LogoSpinner';

const AreaOverview = () => {
	const dispatch = useDispatch();
	const { reports, loading, error } = useSelector((state) => state.reports);

	useEffect(() => {
		dispatch(fetchReports());
	}, [dispatch]);

		return (
			<div className="container my-4">
				<h2 className="mb-4">Area Overview</h2>
				{loading && <LogoSpinner message="Loading reports..." />}
				{error && <div className="alert alert-danger">{error}</div>}
				{!loading && !error && reports.length === 0 && (
					<div className="alert alert-secondary">No reports found for this area.</div>
				)}
				<div className="row g-3">
					{reports.map((report) => (
						<div className="col-12 col-md-6 col-lg-4" key={report.id || report._id}>
							<div className="card h-100 shadow-sm">
								<div className="card-body">
									<h5 className="card-title">{report.title}</h5>
									<p className="card-text">{report.description}</p>
									<p className="card-text mb-1"><span className="fw-semibold">Location:</span> {report.location}</p>
									<p className="card-text"><span className="fw-semibold">Date:</span> {report.createdAt ? new Date(report.createdAt).toLocaleString() : 'N/A'}</p>
								</div>
							</div>
						</div>
					))}
				</div>
			</div>
		);
};

export default AreaOverview;
