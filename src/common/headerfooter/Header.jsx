import React from 'react';
import styles from './Header.module.scss';

function Header({ lefttitle, rightone, righttwo, rightthree }) {
  return (
    <header className={styles.Header}>
      <div className={styles.Left}>{lefttitle}</div>

      {/* 가운데 로고 고정 */}
      <div className={styles.Logo} onClick={() => (window.location.href = '/')}>
        <img src="/소복소복로고.svg" alt="로고" />
      </div>

      <div className={styles.Right}>
        {rightone && <div>{rightone}</div>}
        {righttwo && <div>{righttwo}</div>}
        {rightthree && <div>{rightthree}</div>}
      </div>
    </header>
  );
}

export default Header;
