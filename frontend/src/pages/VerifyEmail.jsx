import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import api from '../utils/api';
import { markEmailVerified } from '../user/userSlice';

const VerifyEmail = () => {
  const { token } = useParams();
  const dispatch = useDispatch();
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    api.get(`/auth/verify-email/${token}`)
      .then(() => {
        dispatch(markEmailVerified());
        setStatus('success');
      })
      .catch(() => setStatus('error'));
  }, [token, dispatch]);

  return (
    <div style={{ maxWidth: 480, margin: '4rem auto', padding: '2rem', textAlign: 'center' }}>
      {status === 'loading' && <p>Verifying your email…</p>}
      {status === 'success' && (
        <>
          <h2>Email verified!</h2>
          <p>Your email address has been confirmed. You can now use all features of StreetLens.</p>
          <Link to="/profile" style={{ marginRight: '1rem' }}>Go to Profile</Link>
          <Link to="/app">Browse Reports</Link>
        </>
      )}
      {status === 'error' && (
        <>
          <h2>Verification failed</h2>
          <p>This link is invalid or has already been used. If you need a new verification email, please contact support.</p>
          <Link to="/profile">Go to Profile</Link>
        </>
      )}
    </div>
  );
};

export default VerifyEmail;
