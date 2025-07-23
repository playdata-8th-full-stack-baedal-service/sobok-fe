import React from 'react';
import styles from './ToastMessage.module.scss'; // SCSS로 색, 아이콘 등 입히기
import { X } from 'lucide-react'; // X 아이콘 (lucide-react나 다른 아이콘도 가능)

const ToastMessage = ({ type, title, message, closeToast }) => {
  return (
    <div className={`${styles.toast} ${styles[type]}`}>
      <div className={styles.icon}>
        {type === 'success' && '✅'}
        {type === 'error' && '❌'}
        {type === 'info' && 'ℹ️'}
        {type === 'warning' && '⚠️'}
      </div>
      <div className={styles.content}>
        <strong>{title}</strong>
        <p>{message}</p>
      </div>
      <button className={styles.closeBtn} onClick={closeToast}>
        <X size={16} />
      </button>
    </div>
  );
};

export default ToastMessage;
