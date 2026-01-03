import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../user/userSlice';
import styles from './NavBar.module.css';

const NavBar = () => {
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.navbarLogo}>StreetLens</div>
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
