import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Input from '../../../../common/components/Input';
import styles from '../UserInfo.module.scss';

function EditableField({ label, value, onEditClick, disabled }) {
  const [editValue, setEditValue] = useState(value);

  useEffect(() => {
    setEditValue(value);
  }, [value]);

  // 실제 프로덕션 수준의 이메일 형식 검증 함수
  const isValidEmail = email => {
    // RFC 5322 기반의 더 엄격한 이메일 검증 패턴
    // 대부분의 실제 서비스에서 사용하는 수준
    const emailRegex =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

    if (!emailRegex.test(email)) return false;

    // 추가 검증 규칙들
    const [localPart, domain] = email.split('@');

    // 로컬 파트 검증 (@ 앞부분)
    if (!localPart || localPart.length > 64) return false; // 최대 64자
    if (localPart.startsWith('.') || localPart.endsWith('.')) return false;
    if (localPart.includes('..')) return false; // 연속된 점 불허

    // 도메인 파트 검증 (@ 뒷부분)
    if (!domain || domain.length > 253) return false; // 최대 253자
    if (domain.startsWith('.') || domain.endsWith('.')) return false;
    if (domain.includes('..')) return false; // 연속된 점 불허
    if (domain.startsWith('-') || domain.endsWith('-')) return false;

    // 도메인 레이블 검증 (각 점으로 구분된 부분)
    const domainParts = domain.split('.');
    if (domainParts.length < 2) return false; // 최소 도메인.확장자 구조

    for (const part of domainParts) {
      if (!part || part.length > 63) return false; // 각 레이블 최대 63자
      if (part.startsWith('-') || part.endsWith('-')) return false;
      if (!/^[a-zA-Z0-9-]+$/.test(part)) return false; // 유효한 문자만
    }

    // 최상위 도메인(TLD) 검증 - 최소 2글자
    const tld = domainParts[domainParts.length - 1];
    if (tld.length < 2 || !/^[a-zA-Z]+$/.test(tld)) return false;

    return true;
  };

  // 변경 버튼 활성화 조건
  const isChangeButtonEnabled = () => {
    if (disabled) return false;

    // 이메일 필드인 경우 이메일 형식 검증
    if (label === '이메일') {
      return editValue.trim() !== '' && isValidEmail(editValue) && editValue !== value;
    }

    // 다른 필드는 기존 로직 유지 (값이 변경되었고 비어있지 않은 경우)
    return editValue.trim() !== '' && editValue !== value;
  };

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
          borderColor:
            label === '이메일' && editValue.trim() !== '' && !isValidEmail(editValue)
              ? 'red'
              : 'initial',
        }}
        onChange={e => setEditValue(e.target.value)}
      />
      {!disabled && (
        <button
          type="button"
          onClick={() => onEditClick(editValue)}
          disabled={!isChangeButtonEnabled()}
          style={{
            opacity: isChangeButtonEnabled() ? 1 : 0.5,
            cursor: isChangeButtonEnabled() ? 'pointer' : 'not-allowed',
          }}
        >
          변경
        </button>
      )}

      {/* 이메일 형식이 잘못된 경우 에러 메시지 표시 */}
      {label === '이메일' && editValue.trim() !== '' && !isValidEmail(editValue) && (
        <div className={styles.errormess}>
          <p style={{ color: 'red', fontSize: '12px', marginTop: '4px', fontWeight : 'bold', marginLeft : '10px' }}>
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
  disabled: PropTypes.bool.isRequired,
};

export default EditableField;
