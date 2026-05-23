import React from 'react';
import { Link } from 'react-router-dom';

const formatDate = (report) => {
  const rawDate = report.created_at;
  if (!rawDate) return 'N/A';

  const parsedDate = new Date(rawDate);
  if (Number.isNaN(parsedDate.getTime())) return 'N/A';

  return parsedDate.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
};

const getDescription = (description) => {
  if (!description) return 'No description available.';
  if (description.length <= 120) return description;
  return `${description.slice(0, 117)}...`;
};

const ReportCard = ({ report }) => {
  const reportId = report.id || report._id;
  const location = report.city || report.location || 'Unknown location';

  return (
    <div className="card h-100 shadow-sm border-0">
      <div className="card-body d-flex flex-column">
        <h3 className="h5 card-title mb-2">{report.title || 'Untitled report'}</h3>
        <p className="card-text text-muted mb-3">{getDescription(report.description)}</p>
        <div className="small text-muted mt-auto d-flex flex-column gap-1">
          <span><strong>Location:</strong> {location}</span>
          <span><strong>Date:</strong> {formatDate(report)}</span>
        </div>
      </div>
      {reportId && (
        <div className="card-footer bg-white border-0 pt-0 pb-3 px-3">
          <Link to={`/report/${reportId}`} className="btn btn-sm btn-outline-primary">
            View details
          </Link>
        </div>
      )}
    </div>
  );
};

export default ReportCard;