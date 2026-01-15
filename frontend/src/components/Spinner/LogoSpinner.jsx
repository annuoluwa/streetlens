import React from 'react';
import styles from './LogoSpinner.module.css';
import logo from '../../logo/streetlens-logo.png';

//spinner
const LogoSpinner = ({ message }) => (
  <div className={styles.wrapper} role="status" aria-live="polite">
    <img src={logo} alt="Loading" className={styles.spinner} />
    {message && <p className={styles.message}>{message}</p>}
  </div>
);

export default LogoSpinner;
