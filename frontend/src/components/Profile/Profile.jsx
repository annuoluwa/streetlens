import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { logout, resetPassword } from '../../user/userSlice';
import { deleteAccount } from '../../user/deleteAccount';
import { fetchReports } from '../../report/reportSlice';
import styles from './Profile.module.css';

const Profile = () => {
  const dispatch = useDispatch();
  const { user, loading, error } = useSelector((state) => state.user);
  const { reports } = useSelector((state) => state.reports);
  const [showReset, setShowReset] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [resetMessage, setResetMessage] = useState('');
  const [showDanger, setShowDanger] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [deleteError, setDeleteError] = useState('');
  const handleDeleteAccount = async () => {
    setDeleteError('');
    try {
      await dispatch(deleteAccount()).unwrap();
      dispatch(logout());
    } catch (err) {
      setDeleteError(err || 'Account deletion failed.');
    }
  };

  useEffect(() => {
    if (user) {
      dispatch(fetchReports());
    }
  }, [dispatch, user]);

  if (!user) {
    return <div className={styles.profileContainer}>You must be signed in to view your profile.</div>;
  }

  const handleLogout = () => {
    dispatch(logout());
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    setResetMessage('');
    if (newPassword !== confirmPassword) {
      setResetMessage('New passwords do not match.');
      return;
    }
    try {
      const resultAction = await dispatch(resetPassword({ oldPassword, newPassword }));
      if (resetPassword.fulfilled.match(resultAction)) {
        setResetMessage('Password reset successful.');
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setResetMessage(resultAction.payload || 'Password reset failed.');
      }
    } catch (err) {
      setResetMessage('Password reset failed.');
    }
  };

  // Filter and sort reports for this user
  const userReports = Array.isArray(reports)
    ? reports.filter(r => r.user_id === user.id).sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    : [];

  return (
    <div className={styles.profileContainer}>
      <h2>My Profile</h2>
      <div className={styles.infoGroup}><strong>Email:</strong> {user.email}</div>
      <div className={styles.infoGroup}><strong>Username:</strong> {user.username || 'N/A'}</div>
      <button className={styles.button} onClick={handleLogout}>Logout</button>
      <hr />
      <button className={styles.button} onClick={() => setShowReset(!showReset)}>
        {showReset ? 'Cancel Password Reset' : 'Reset Password'}
      </button>
      {showReset && (
        <form className={styles.resetForm} onSubmit={handlePasswordReset}>
          <label>Old Password:
            <input type="password" value={oldPassword} onChange={e => setOldPassword(e.target.value)} required />
          </label>
          <label>New Password:
            <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} required />
          </label>
          <label>Confirm New Password:
            <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required />
          </label>
          <button className={styles.button} type="submit" disabled={loading}>Submit</button>
          {resetMessage && <div className={styles.resetMessage}>{resetMessage}</div>}
          {error && <div className={styles.resetMessage}>{error}</div>}
        </form>
      )}
      <hr />
      <h3>My Reports</h3>
      {userReports.length === 0 ? (
        <div className={styles.infoGroup}>No reports submitted yet.</div>
      ) : (
        <ul className={styles.reportList}>
          {userReports.map(report => (
            <li key={report.id} className={styles.reportItem}>
              <strong>{report.title}</strong> <span style={{color:'#888'}}>{new Date(report.created_at).toLocaleString()}</span>
              <div>{report.description}</div>
              <div><em>Status:</em> {report.admin_flagged ? 'Flagged' : 'Normal'}</div>
            </li>
          ))}
        </ul>
      )}
    <hr />
    <div style={{ marginTop: '2rem', background: '#fff3f3', border: '1px solid #e74c3c', borderRadius: 8, padding: '1.2rem' }}>
      <h4 style={{ color: '#c0392b', marginBottom: 8 }}>Danger Zone</h4>
      <p style={{ color: '#b94a48', marginBottom: 16 }}>Deleting your account is irreversible. All your reports and data will be permanently removed. This action cannot be undone.</p>
      {!deleteConfirm ? (
        <button className={styles.button} style={{ background: '#e74c3c' }} onClick={() => setDeleteConfirm(true)}>
          Delete My Account
        </button>
      ) : (
        <div style={{ marginTop: 8 }}>
          <p style={{ color: '#b94a48', fontWeight: 500 }}>Are you absolutely sure? This cannot be undone.</p>
          <button className={styles.button} style={{ background: '#e74c3c', marginRight: 8 }} onClick={handleDeleteAccount} disabled={loading}>
            Yes, Delete Permanently
          </button>
          <button className={styles.button} style={{ background: '#bbb', color: '#222' }} onClick={() => setDeleteConfirm(false)}>
            Cancel
          </button>
          {deleteError && <div className={styles.resetMessage}>{deleteError}</div>}
        </div>
      )}
    </div>
  </div>
  );
};

export default Profile;
