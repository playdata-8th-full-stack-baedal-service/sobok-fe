import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import styles from '../UserInfo.module.scss';

function EditableField({ label, value, onEditClick, onDeleteClick, disabled }) {
  const [editValue, setEditValue] = useState(value);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    setEditValue(value);
  }, [value]);

  const isValidEmail = email => {
    const emailRegex =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    if (!emailRegex.test(email)) return false;

    const [localPart, domain] = email.split('@');
    if (!localPart || localPart.length > 64) return false;
    if (localPart.startsWith('.') || localPart.endsWith('.') || localPart.includes('..'))
      return false;

    if (!domain || domain.length > 253) return false;
    if (domain.startsWith('.') || domain.endsWith('.') || domain.includes('..')) return false;

    const domainParts = domain.split('.');
    if (domainParts.length < 2) return false;
    for (const part of domainParts) {
      if (!part || part.length > 63) return false;
      if (part.startsWith('-') || part.endsWith('-') || !/^[a-zA-Z0-9-]+$/.test(part)) return false;
    }
    const tld = domainParts[domainParts.length - 1];
    return !(tld.length < 2 || !/^[a-zA-Z]+$/.test(tld));
  };

  const handleComplete = () => {
    if (label === '전화번호') {
      if (!editValue.trim()) {
        alert('전화번호는 필수 항목입니다.');
        return;
      }
      onEditClick(editValue);
    } else if (label === '이메일') {
      if (!editValue.trim()) {
        onDeleteClick?.();
        setIsEditing(false);
        return;
      }
      if (!isValidEmail(editValue)) return;
      onEditClick(editValue);
    }
    setIsEditing(false);
  };

  return (
    <div className={styles.fieldRow}>
      <label htmlFor={label}>{label}</label>
      <input
        type="text"
        value={editValue}
        disabled={!isEditing || disabled}
        id={label}
        style={{
          backgroundColor: !isEditing || disabled ? 'lightgray' : 'white',
          borderColor:
            label === '이메일' && editValue.trim() !== '' && !isValidEmail(editValue)
              ? 'red'
              : 'initial',
        }}
        onChange={e => setEditValue(e.target.value)}
      />
      {!isEditing && !disabled && (
        <button type="button" onClick={() => setIsEditing(true)}>
          변경
        </button>
      )}
      {isEditing && !disabled && (
        <button type="button" onClick={handleComplete} style={{ opacity: 1, cursor: 'pointer' }}>
          완료
        </button>
      )}
      {label === '이메일' && isEditing && editValue.trim() !== '' && !isValidEmail(editValue) && (
        <div className={styles.errormess}>
          <p
            style={{
              color: 'red',
              fontSize: '12px',
              marginTop: '4px',
              fontWeight: 'bold',
              marginLeft: '10px',
            }}
          >
            올바른 이메일 형식을 입력해주세요.
          </p>
        </div>
      )}
    </div>
  );
}

EditableField.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onEditClick: PropTypes.func.isRequired,
  onDeleteClick: PropTypes.func,
  disabled: PropTypes.bool.isRequired,
};

export default EditableField;
