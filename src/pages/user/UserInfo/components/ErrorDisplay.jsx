import React from 'react';
import { User } from 'lucide-react';
import styles from '../UserInfoPage.module.scss';

function ErrorDisplay({ error, onRetry, showIcon = true }) {
  return (
    <div className={styles.errorContainer}>
      <div className={styles.errorContent}>
        {showIcon && (
          <div className={styles.errorIcon}>
            <User size={48} />
          </div>
        )}
        <p className={styles.errorMessage}>{error}</p>
        {onRetry && (
          <button type="button" onClick={onRetry} className={styles.retryBtn}>
            다시 시도
          </button>
        )}
      </div>
    </div>
  );
}

export default ErrorDisplay;
