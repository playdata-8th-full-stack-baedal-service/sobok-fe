import { Facebook, Instagram, Rss, Youtube } from 'lucide-react';
import React from 'react';
import styles from './Footer.module.scss';

function Footer() {
  const handleLogoClick = () => {
    const role = localStorage.getItem('USER_ROLE');

    if (role === 'HUB') {
      window.location.href = '/hub';
    } else if (role === 'RIDER') {
      window.location.href = '/rider';
    } else if (role === 'ADMIN') {
      window.location.href = '/admin';
    } else if (role === 'USER') {
      window.location.href = '/user/main';
    } else {
      window.location.href = '/';
    }
  };

  return (
    <>
      <div className={styles.Footer}>
        <div className={styles.logofooter} onClick={handleLogoClick}>
          <img src="/소복소복로고.svg" className={styles.logoimg} />
        </div>

        <div>
          <Instagram size={30} />
        </div>
        <div>
          <Facebook size={30} />
        </div>
        <div>
          <Youtube size={30} />
        </div>
      </div>
      <div className={styles.copyright}>
        <p className={styles.copyrightword}>
          © 2025 SOBOK. All rights reserved. Unauthorized duplication is a violation of applicable
          laws.
        </p>
      </div>
    </>
  );
}

export default Footer;
