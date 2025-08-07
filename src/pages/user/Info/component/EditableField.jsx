import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import styles from '../UserInfo.module.scss';

function EditableField({ label, value, onEditClick, onDeleteClick, disabled, showDeleteButton }) {
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

  // 전화번호 입력 처리
  const handlePhoneInputChange = e => {
    const value = e.target.value;
    const numericValue = value.replace(/[^0-9]/g, '');
    const limitedValue = numericValue.slice(0, 11);
    setEditValue(limitedValue);
  };

  const handlePhoneKeyDown = e => {
    const allowedKeys = [
      'Backspace', 'Delete', 'Tab', 'Escape', 'Enter',
      'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown',
      'Home', 'End'
    ];
    if (e.ctrlKey || e.metaKey) return;
    if (!allowedKeys.includes(e.key) && !/^[0-9]$/.test(e.key)) {
      e.preventDefault();
      return;
    }
    if (/^[0-9]$/.test(e.key) && editValue.length >= 11) {
      e.preventDefault();
    }
  };

  const handlePhonePaste = e => {
    e.preventDefault();
    const pastedText = (e.clipboardData || window.clipboardData).getData('text');
    const numericValue = pastedText.replace(/[^0-9]/g, '').slice(0, 11);
    setEditValue(numericValue);
  };

  const handleComplete = () => {
    if (label === '전화번호') {
      if (!editValue.trim()) {
        alert('전화번호는 필수 항목입니다.');
        return;
      }
      onEditClick(editValue);
    } else if (label === '이메일') {
      const trimmedValue = editValue.trim();
      if (!trimmedValue) {
        // 공백 입력 시 원래 값 복원
        setEditValue(value);
        setIsEditing(false);
        return;
      }
      if (!isValidEmail(trimmedValue)) {
        // 잘못된 형식 시 원래 값 복원
        setEditValue(value);
        setIsEditing(false);
        return;
      }
      onEditClick(trimmedValue, () => {
        setEditValue(value);
      });
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
        onChange={label === '전화번호' ? handlePhoneInputChange : e => setEditValue(e.target.value)}
        onKeyDown={label === '전화번호' ? handlePhoneKeyDown : undefined}
        onPaste={label === '전화번호' ? handlePhonePaste : undefined}
        inputMode={label === '전화번호' ? 'numeric' : undefined}
        pattern={label === '전화번호' ? '[0-9]*' : undefined}
        maxLength={label === '전화번호' ? 11 : undefined}
      />
      {!isEditing && !disabled && (
        <>
          <button type="button" onClick={() => setIsEditing(true)}>
            변경
          </button>
          {showDeleteButton && (
            <button type="button" onClick={onDeleteClick}>
              삭제
            </button>
          )}
        </>
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
  showDeleteButton: PropTypes.bool,
};

export default EditableField;
