import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styles from './RiderPasswordModal.module.scss';

function RiderPasswordModal({ onSubmit, onClose, loading, error }) {
  const [input, setInput] = useState('');

  const handleSubmit = e => {
    e.preventDefault();
    onSubmit(input);
  };

  return (
    <form onSubmit={handleSubmit} className={styles.RiderPasswordModal}>
      <h3 className={styles.title}>비밀번호 입력</h3>
      <input
        type="password"
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder="비밀번호를 입력하세요."
        disabled={loading}
        className={styles.input}
      />
      {error && <div className={styles.error}>{error}</div>}
      <div className={styles.buttonGroup}>
        <button
          type="button"
          onClick={onClose}
          disabled={loading}
          className={`${styles.button} ${styles.cancel}`}
        >
          취소
        </button>
        <button
          type="submit"
          disabled={loading || !input}
          className={`${styles.button} ${styles.submit}`}
        >
          {loading ? '확인 중...' : '확인'}
        </button>
      </div>
    </form>
  );
}

RiderPasswordModal.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  error: PropTypes.string,
};

RiderPasswordModal.defaultProps = {
  error: '',
};

export default RiderPasswordModal;
