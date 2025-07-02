import React from 'react';
import styles from './Header.module.scss';

function Header({ lefttitle, rightone, righttwo, rightthree }) {
  const handleLogoClick = () => {
    const role = localStorage.getItem('userRole');

    // 역할에 따라 메인 페이지 경로 설정
    if (role === 'HUB') {
      window.location.href = '/hub';
    } else if (role === 'RIDER') {
      window.location.href = '/rider';
    } else if (role === 'USER') {
      window.location.href = '/user/main';
    } else {
      window.location.href = '/';
    }
  };

  return (
    <header className={styles.Header}>
      <div className={styles.Left}>{lefttitle}</div>

      {/* 가운데 로고 클릭 시 역할에 따라 이동 */}
      <div className={styles.Logo} onClick={handleLogoClick}>
        <img src="/소복소복로고.svg" alt="로고" />
      </div>

      <div className={styles.Right}>
        {rightone && <div>{rightone}</div>}
        {righttwo && <div>{righttwo}</div>}
        {rightthree && <div >{rightthree}</div>}
      </div>
    </header>
  );
}

export default Header;
