
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import api from '../utils/api';
import { deleteReport as deleteReportApi } from '../utils/deleteReport';
import styles from './ReportDetailsPage.module.css';

const ReportDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = useSelector(state => state.user.user);
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState(null);
  // Only allow delete if user is the report owner
  // Fallback: if report.user_id is missing, allow delete if user.id === report.id (for debugging)
  const canDelete = user && report && (report.user_id ? user.id === report.user_id : user.id === report.id);

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this report? This cannot be undone.')) return;
    setDeleteLoading(true);
    setDeleteError(null);
    try {
      await deleteReportApi(id);
      navigate('/'); // Redirect to home or reports list
    } catch (err) {
      setDeleteError(err?.response?.data?.message || 'Failed to delete report');
    } finally {
      setDeleteLoading(false);
    }
  };




  const [currentImage, setCurrentImage] = useState(0);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [replyTo, setReplyTo] = useState(null);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [replyIsAnonymous, setReplyIsAnonymous] = useState(false);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const res = await api.get(`/reports/${id}`);
        setReport(res.data);
      } catch (err) {
        setError('Failed to load report details');
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, [id]);

  // Fetch comments for this report
  const fetchComments = async () => {
    try {
      const res = await api.get(`/reports/${id}/comments`);
      setComments(res.data);
    } catch (err) {
      //  handle error
    }
  };
  useEffect(() => {
    if (id) fetchComments();
    // eslint-disable-next-line
  }, [id]);



  if (loading) return <div className="alert alert-info">Loading...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;
  if (!report) return <div className="alert alert-secondary">No report found.</div>;

  // Images: report.evidence_files (array of filenames)
  const images = Array.isArray(report.evidence_files) ? report.evidence_files : [];
  const imageBaseUrl = process.env.REACT_APP_API_URL || window.location.origin;

  const handlePrev = () => {
    setCurrentImage((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };
  const handleNext = () => {
    setCurrentImage((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  // Recursive comment rendering
  const renderComments = (commentsArr, parentId = null, level = 0) => (
    <div style={{ marginLeft: level * 24 }}>
      {commentsArr.map(comment => (
        <div key={comment.id} className={styles.commentBox}>
          <div className={styles.commentHeader}>
            <span className={styles.commentAuthor}>{comment.is_anonymous ? 'Anonymous' : 'User'}</span>
            <span className={styles.commentDate}>{new Date(comment.created_at).toLocaleString()}</span>
          </div>
          <div className={styles.commentText}>{comment.content}</div>
          <button className={styles.replyBtn} onClick={() => {
            setReplyTo(comment.id);
            setReplyContent('');
            setReplyIsAnonymous(false);
          }}>Reply</button>
          {replyTo === comment.id && (
            <form
              className={styles.replyForm}
              onSubmit={async e => {
                e.preventDefault();
                if (!replyContent.trim()) return;
                try {
                  await api.post(`/reports/${id}/comments`, {
                    content: replyContent,
                    parent_comment_id: comment.id,
                    is_anonymous: replyIsAnonymous,
                  });
                  setReplyContent('');
                  setReplyIsAnonymous(false);
                  setReplyTo(null);
                  fetchComments();
                } catch (err) {
                  //  handle error
                }
              }}
            >
              <textarea
                className={styles.replyInput}
                placeholder="Write a reply..."
                rows={2}
                autoFocus
                value={replyContent}
                onChange={e => setReplyContent(e.target.value)}
              />
              <label className={styles.anonCheckboxLabel}>
                <input
                  type="checkbox"
                  checked={replyIsAnonymous}
                  onChange={e => setReplyIsAnonymous(e.target.checked)}
                />
                Post as Anonymous
              </label>
              <button type="submit" className={styles.replySubmitBtn}>Post Reply</button>
              <button type="button" className={styles.replyCancelBtn} onClick={() => setReplyTo(null)}>Cancel</button>
            </form>
          )}
          {comment.replies && comment.replies.length > 0 && renderComments(comment.replies, comment.id, level + 1)}
        </div>
      ))}
    </div>
  );

  return (
    <div className="container my-4">
      <div className="card shadow p-4 mb-4">
        <div className="position-relative mb-3">
          {report.is_flagged && (
            <span className="position-absolute top-0 end-0 m-2" title="Flagged as negative/sensitive">
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                <polygon points="20,5 37,35 3,35" fill="#e74c3c" />
                <rect x="19" y="15" width="2" height="10" rx="1" fill="#fff" />
                <rect x="19" y="27" width="2" height="2" rx="1" fill="#fff" />
              </svg>
            </span>
          )}
          <h2 className="mb-2">{report.title}</h2>
          <div className="d-flex flex-wrap gap-3 small text-muted mb-2">
            <span><strong>Location:</strong> {report.city || report.location}</span>
            <span><strong>Date:</strong> {report.created_at ? new Date(report.created_at).toLocaleString() : 'N/A'}</span>
          </div>
        </div>
        {canDelete && (
          <div className="d-flex justify-content-end mb-2">
            <button
              className="btn btn-danger btn-sm"
              onClick={handleDelete}
              disabled={deleteLoading}
            >
              {deleteLoading ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        )}
        {deleteError && <div className="alert alert-danger py-2 mb-2">{deleteError}</div>}
        {images.length > 0 && (
          <div className="d-flex align-items-center justify-content-center mb-3 gap-2">
            <button className="btn btn-outline-secondary btn-sm" onClick={handlePrev}>&lt;</button>
            <img
              className="rounded border"
              style={{ maxHeight: 260, maxWidth: '100%' }}
              src={`${imageBaseUrl}/uploads/${images[currentImage]}`}
              alt={`Evidence ${currentImage + 1}`}
            />
            <button className="btn btn-outline-secondary btn-sm" onClick={handleNext}>&gt;</button>
            <div className="ms-2 small text-muted">{currentImage + 1} / {images.length}</div>
          </div>
        )}
        <div className="mb-3">{report.description}</div>
        <div className="row g-2 mb-3">
          <div className="col-6 col-md-4"><strong>Postcode:</strong> {report.postcode || 'N/A'}</div>
          <div className="col-6 col-md-4"><strong>Street:</strong> {report.street || 'N/A'}</div>
          <div className="col-6 col-md-4"><strong>Property Type:</strong> {report.property_type || 'N/A'}</div>
          <div className="col-6 col-md-4"><strong>Landlord/Agency:</strong> {report.landlord_or_agency || 'N/A'}</div>
          <div className="col-6 col-md-4"><strong>Advert Source:</strong> {report.advert_source || 'N/A'}</div>
          <div className="col-6 col-md-4"><strong>Category:</strong> {report.category || 'N/A'}</div>
          <div className="col-6 col-md-4"><strong>Anonymous:</strong> {report.is_anonymous ? 'Yes' : 'No'}</div>
        </div>
      </div>
      {/* Comments Section */}
      <div className="card shadow p-4">
        <h3 className="mb-3 d-flex align-items-center gap-2">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{height: '1.5em'}}><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
          Comments <span className="fw-normal text-primary">({comments.length})</span>
        </h3>
        <form
          className="mb-3"
          onSubmit={async e => {
            e.preventDefault();
            if (!newComment.trim()) return;
            try {
              await api.post(`/reports/${id}/comments`, {
                content: newComment,
                is_anonymous: isAnonymous,
              });
              setNewComment('');
              setIsAnonymous(false);
              fetchComments();
            } catch (err) {
              //  handle error
            }
          }}
        >
          <textarea
            className="form-control mb-2"
            placeholder="Write a comment..."
            rows={3}
            value={newComment}
            onChange={e => setNewComment(e.target.value)}
          />
          <div className="form-check mb-2">
            <input
              className="form-check-input"
              type="checkbox"
              checked={isAnonymous}
              onChange={e => setIsAnonymous(e.target.checked)}
              id="anonCheck"
            />
            <label className="form-check-label" htmlFor="anonCheck">
              Post as Anonymous
            </label>
          </div>
          <button type="submit" className="btn btn-primary btn-sm">Post Comment</button>
        </form>
        <div>
          {renderComments(comments)}
        </div>
      </div>
    </div>
  );
};

export default ReportDetailsPage;
