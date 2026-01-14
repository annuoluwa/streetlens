import React from 'react';
import styles from './Footer.module.css';

const Footer = () => (
  <footer className={styles.footer}>
    <div className={styles.container}>
      <span className={styles.brand}>StreetLens</span>
      <span className={styles.copyright}>&copy; {new Date().getFullYear()} StreetLens. All rights reserved.</span>
      <span className={styles.links}>
        <a href="/about" className={styles.link}>About</a>
        <a href="/privacy" className={styles.link}>Privacy</a>
        <a href="/contact" className={styles.link}>Contact</a>
      </span>
    </div>
  </footer>
);

export default Footer;
