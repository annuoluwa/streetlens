import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchReports } from '../report/reportSlice';
import { useNavigate } from 'react-router-dom';
import LogoSpinner from '../components/Spinner/LogoSpinner';


const HomeFeed = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { reports, loading, error } = useSelector((state) => state.reports);

  useEffect(() => {
	 dispatch(fetchReports());
  }, [dispatch]);

  const reportList = Array.isArray(reports) ? reports : [];

		return (
			<div className="container my-4">
				<h2 className="mb-4">Latest Reports</h2>
				{loading ? (
					<div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
						<LogoSpinner message="Loading reports..." />
					</div>
				) : (
					<>
						{error && <div className="alert alert-danger">{error}</div>}
						{!error && reportList.length === 0 && (
							<div className="alert alert-secondary">No reports available.</div>
						)}
						<div className="row g-3">
							{reportList.map((report) => {
								const baseOrigin = process.env.REACT_APP_API_URL || window.location.origin;
								const imageUrl = report.evidence_url
									? report.evidence_url
									: report.evidence
										? `${baseOrigin}/uploads/${report.evidence}`
										: null;
								return (
									<div
										key={report.id || report._id}
										className="col-12 col-md-6 col-lg-4"
										onClick={() => navigate(`/report/${report.id || report._id}`)}
										style={{ cursor: 'pointer' }}
									>
										<div className="card h-100 shadow-sm position-relative">
											{report.is_flagged && (
												<span className="position-absolute top-0 end-0 m-2" title="Flagged as negative/sensitive">
													<svg width="32" height="32" viewBox="0 0 40 40" fill="none" style={{filter: 'drop-shadow(0 2px 8px #c0392b88)'}}>
														<polygon points="20,5 37,35 3,35" fill="#e74c3c" />
														<rect x="19" y="15" width="2" height="10" rx="1" fill="#fff" />
														<rect x="19" y="27" width="2" height="2" rx="1" fill="#fff" />
													</svg>
												</span>
											)}
											{imageUrl && (
												<img src={imageUrl} alt="evidence" className="card-img-top" style={{ objectFit: 'cover', maxHeight: 180 }} />
											)}
											<div className="card-body">
												<h5 className="card-title">{report.title}</h5>
												<p className="card-text">{report.description}</p>
												<div className="d-flex flex-wrap justify-content-between small text-muted">
													<span><strong>Location:</strong> {report.city || report.location}</span>
													<span><strong>Date:</strong> {
														report.created_at
															? new Date(report.created_at).toLocaleString()
															: report.createdAt
																? new Date(report.createdAt).toLocaleString()
																: 'N/A'
													}</span>
												</div>
											</div>
										</div>
									</div>
								);
							})}
						</div>
					</>
				)}
			</div>
		);
};

export default HomeFeed;
