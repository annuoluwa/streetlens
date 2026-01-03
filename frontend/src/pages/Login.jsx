


import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../user/userSlice';
import { Link, useNavigate } from 'react-router-dom';
import styles from './Login.module.css';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, user } = useSelector((state) => state.user);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleEyeClick = () => setShowPassword((prev) => !prev);

  useEffect(() => {
    if (user) {
      setSuccess(true);
      setTimeout(() => {
        navigate('/');
      }, 1500);
    }
  }, [user, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginUser({ email, password }));
  };

  return (
    <div className={styles.loginContainer}>
      <h2>Login</h2>
      <form className={styles.loginForm} onSubmit={handleSubmit}>
        <div className={styles.loginRow}>
          <label className={styles.loginLabel}>Email:</label>
          <div className={styles.loginInputWrap}>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{ width: '100%' }}
            />
          </div>
        </div>
        <div className={styles.loginRow}>
          <label className={styles.loginLabel}>Password:</label>
          <div className={styles.loginInputWrap}>
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ paddingRight: '2.5rem', width: '100%' }}
            />
            <span
              onClick={handleEyeClick}
              style={{
                display: 'flex',
                alignItems: 'center',
                position: 'absolute',
                right: '0.75rem',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                userSelect: 'none',
                padding: 0,
              }}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ pointerEvents: 'none' }}>
                  <ellipse cx="12" cy="12" rx="8" ry="5" />
                  <circle cx="12" cy="12" r="2" />
                </svg>
              ) : (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ pointerEvents: 'none' }}>
                  <ellipse cx="12" cy="12" rx="8" ry="5" />
                  <line x1="4" y1="19" x2="20" y2="5" />
                </svg>
              )}
            </span>
          </div>
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
        {error && <div className={styles.error}>{error}</div>}
        {success && <div className={styles.success}>Login successful! Redirecting...</div>}
      </form>
      <div className={styles.signupLink}>
        Not a member yet?{' '}
        <Link to="/register">Sign up here</Link>
      </div>
    </div>
  );
};

export default Login;
