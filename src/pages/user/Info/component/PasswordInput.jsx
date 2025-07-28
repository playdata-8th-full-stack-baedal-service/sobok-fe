/* eslint-disable jsx-a11y/mouse-events-have-key-events */
/* eslint-disable no-return-assign */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import PropTypes from 'prop-types';
import styles from '../UserInfo.module.scss';

function PasswordInput({ placeholder, onChange, value }) {
  const [showPassword, setShowPassword] = useState(false);

  const onTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className={styles.passwordInput}>
      <label className={styles.passwordInputtitle}>비밀번호</label>
      <div className={styles.passwordInputzone}>
        <input
          type={showPassword ? 'text' : 'password'}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={styles.passwordInputmain}
        />
        <button type="button" onClick={onTogglePassword}>
          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
      </div>
    </div>
  );
}

PasswordInput.propTypes = {
  placeholder: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
};

export default PasswordInput;
