import React from 'react';
import { Eye, EyeOff } from 'lucide-react';
import styles from './PasswordInput.module.scss';

function PasswordInput({
  value,
  onChange,
  showPassword,
  onTogglePassword,
  placeholder,
  error,
  id = 'password',
}) {
  return (
    <div className={styles.container}>
      <label htmlFor={id} className={styles.label}>
        비밀번호
      </label>
      <div className={styles.inputWrapper}>
        <input
          id={id}
          type={showPassword ? 'text' : 'password'}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={styles.input}
        />
        <button type="button" onClick={onTogglePassword} className={styles.toggleButton}>
          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
      </div>
      {error && <p className={styles.error}>{error}</p>}
    </div>
  );
}

export default PasswordInput;
