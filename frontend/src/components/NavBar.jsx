import React, { useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../user/userSlice';
import { fetchFlaggedReportsCount } from '../report/flaggedReportsSlice';
import styles from './NavBar.module.css';
import logo from '../logo/streetlens-logo.png';


const NavBar = () => {
  const { user, token } = useSelector((state) => state.user);
  const { count: flaggedCount } = useSelector((state) => state.flaggedReports || { count: 0 });
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (user && user.role === 'admin' && token) {
      dispatch(fetchFlaggedReportsCount(token));
    }
  }, [user, token, dispatch]);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.navbarLogo}>
        <img src={logo} alt="StreetLens Logo" className={styles.logoImg} />
        <span className={styles.logoText}>StreetLens</span>
      </div>
      <ul className={styles.navbarLinks}>
        <li>
          <NavLink to="/" end className={({ isActive }) => isActive ? styles.active : styles.navbarLink}>Home</NavLink>
        </li>
        <li>
          <NavLink to="/add-report" className={({ isActive }) => isActive ? styles.active : styles.navbarLink}>Add Report</NavLink>
        </li>
        <li>
          <NavLink to="/area-overview" className={({ isActive }) => isActive ? styles.active : styles.navbarLink}>Area Overview</NavLink>
        </li>
        {user && user.role === 'admin' && (
          <li style={{ position: 'relative' }}>
            <NavLink to="/admin" className={({ isActive }) => isActive ? styles.active : styles.navbarLink}>
              Admin
              {flaggedCount > 0 && (
                <span style={{
                  position: 'absolute',
                  top: '-8px',
                  right: '-18px',
                  background: '#d32f2f',
                  color: '#fff',
                  borderRadius: '50%',
                  padding: '2px 7px',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  minWidth: 22,
                  textAlign: 'center',
                  zIndex: 2
                }}>{flaggedCount}</span>
              )}
            </NavLink>
          </li>
        )}
        {!user && (
          <li>
            <NavLink to="/login" className={({ isActive }) => isActive ? styles.active : styles.navbarLink}>Login</NavLink>
          </li>
        )}
        {user && (
          <li>
            <button onClick={handleLogout} className={styles.navbarLink} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
              Logout
            </button>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default NavBar;
