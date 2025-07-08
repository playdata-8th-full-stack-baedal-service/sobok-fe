import React from 'react';
import styles from './ModalWrapper.module.scss';

function ModalWrapper({ title, onClose, children, size = 'md' }) {
  const handleOverlayClick = e => {
    // e.target === e.currentTarget일 때만 바깥 클릭임
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className={styles.overlay} onClick={handleOverlayClick}>
      <div className={`${styles.modalBox} ${styles[size]}`}>
        <div className={styles.header}>
          <h2>{title}</h2>
          <button className={styles.closeBtn} onClick={onClose}>
            ✕
          </button>
        </div>
        <div className={styles.content}>{children}</div>
      </div>
    </div>
  );
}

export default ModalWrapper;
