import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import styles from '../UserInfo.module.scss';

function AuthCodeEditableField({ label, value, onEditClick, disabled, timer }) {
  const [editValue, setEditValue] = useState(value);

  useEffect(() => {
    setEditValue(value);
  }, [value]);

  return (
    <div className={styles.fieldRow}>
      <label htmlFor={label}>{label}</label>
      <input
        type="text"
        value={editValue}
        disabled={disabled}
        id={label}
        style={{
          backgroundColor: disabled ? 'lightgray' : 'white',
        }}
        onChange={e => setEditValue(e.target.value)}
      />
      <span className={styles.timer}>
        {Math.floor(timer / 60)
          .toString()
          .padStart(2, '0')}
        :
        {Math.floor(timer % 60)
          .toString()
          .padStart(2, '0')}
      </span>
      {!disabled && (
        <button type="button" onClick={() => onEditClick(editValue)}>
          인증
        </button>
      )}
    </div>
  );
}

AuthCodeEditableField.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onEditClick: PropTypes.func.isRequired,
  disabled: PropTypes.bool.isRequired,
};

export default AuthCodeEditableField;
