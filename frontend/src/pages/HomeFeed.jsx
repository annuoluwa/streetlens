import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchReports } from '../report/reportSlice';
import { useNavigate } from 'react-router-dom';
import styles from './HomeFeed.module.css';

const HomeFeed = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { reports, loading, error } = useSelector((state) => state.reports);

  useEffect(() => {
	 dispatch(fetchReports());
  }, [dispatch]);

  const reportList = Array.isArray(reports) ? reports : [];

	return (
		<div className={styles.homeFeedContainer}>
			<div className={styles.header}>Latest Reports</div>
			{loading && <div>Loading reports...</div>}
			{error && <div className={styles.error}>{error}</div>}
			{!loading && !error && reportList.length === 0 && <div>No reports available.</div>}
			<div className={styles.reportGrid}>
				{reportList.map((report) => {
					// Assume evidence filename is stored as report.evidence or similar
					// If not, adjust this logic to match your backend response
					const imageUrl = report.evidence
						? `${process.env.REACT_APP_API_URL || 'http://localhost:8000'}/uploads/${report.evidence}`
						: null;
					return (
						<div
							key={report.id || report._id}
							className={styles.reportCard}
							onClick={() => navigate(`/report/${report.id || report._id}`)}
						>
							{report.is_flagged && (
								<span className={styles.flaggedNegative} title="Flagged as negative/sensitive">
									<svg width="32" height="32" viewBox="0 0 40 40" fill="none" style={{filter: 'drop-shadow(0 2px 8px #c0392b88)'}}>
										<polygon points="20,5 37,35 3,35" fill="#e74c3c" />
										<rect x="19" y="15" width="2" height="10" rx="1" fill="#fff" />
										<rect x="19" y="27" width="2" height="2" rx="1" fill="#fff" />
									</svg>
								</span>
							)}
							{imageUrl && (
								<img src={imageUrl} alt="evidence" className={styles.reportImage} />
							)}
							<div className={styles.reportTitle}>{report.title}</div>
							<div className={styles.reportDescription}>{report.description}</div>
							<div className={styles.reportMeta}>
								<span><strong>Location:</strong> {report.city || report.location}</span>
								<span><strong>Date:</strong> {report.createdAt ? new Date(report.createdAt).toLocaleString() : 'N/A'}</span>
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
};

export default HomeFeed;
