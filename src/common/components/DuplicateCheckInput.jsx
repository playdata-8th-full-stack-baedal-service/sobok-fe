import React from 'react';
import styles from './DuplicateCheckInput.module.scss';

function DuplicateCheckInput({
  label,
  value,
  onChange,
  onCheck,
  loading,
  success,
  error,
  placeholder,
  buttonLabel = '중복확인',
  disabled = false,
  inputId,
}) {
  return (
    <div className={styles.container}>
      {label && (
        <label htmlFor={inputId} className={styles.label}>
          {label}
        </label>
      )}
      <div className={styles.inputRow}>
        <input
          id={inputId}
          name={inputId}
          type="text"
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          className={styles.input}
        />
        <button
          type="button"
          onClick={onCheck}
          disabled={loading || disabled || !value.trim()}
          className={styles.button}
        >
          {loading ? '처리 중...' : buttonLabel}
        </button>
      </div>
      {success && <p className={styles.success}>{success}</p>}
      {error && <p className={styles.error}>{error}</p>}
    </div>
  );
}

export default DuplicateCheckInput;
