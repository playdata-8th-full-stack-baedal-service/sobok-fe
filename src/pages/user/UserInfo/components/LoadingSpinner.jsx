import React from 'react';
import styles from '../UserInfoPage.module.scss';

function LoadingSpinner({ message = '회원정보를 불러오는 중...' }) {
  return (
    <div className={styles.loadingContainer}>
      <div className={styles.loadingContent}>
        <div className={styles.spinner} />
        <p>{message}</p>
      </div>
    </div>
  );
}

export default LoadingSpinner;
