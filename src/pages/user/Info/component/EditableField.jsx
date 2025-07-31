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

  // 실제 프로덕션 수준의 한국 전화번호 형식 검증 함수
  const isValidPhone = phone => {
    // 숫자만 있는지 확인
    if (!/^\d+$/.test(phone)) return false;

    // 전화번호 길이 및 형식 검증
    if (phone.length < 10 || phone.length > 11) return false;

    // 한국 전화번호 패턴 검증
    // 휴대폰: 010, 011, 016, 017, 018, 019로 시작하는 11자리
    // 일반전화: 02, 031~070으로 시작하는 9~10자리
    // 070: 인터넷전화 11자리
    // 080: 무료전화 11자리
    // 1588, 1577, 1566, 1544 등: 고객센터 번호 8자리

    // 휴대폰 번호 (11자리)
    if (phone.length === 11) {
      // 010, 011, 016, 017, 018, 019로 시작
      if (/^01[01678910]\d{8}$/.test(phone)) return true;
      // 070 인터넷전화
      if (/^070\d{8}$/.test(phone)) return true;
      // 080 무료전화
      if (/^080\d{8}$/.test(phone)) return true;
      return false;
    }

    // 일반전화 (9~10자리)
    if (phone.length === 9 || phone.length === 10) {
      // 서울 02 (9자리: 02 + 7자리 또는 8자리)
      if (phone.startsWith('02')) {
        if (phone.length === 9 && /^02\d{7}$/.test(phone)) return true;
        if (phone.length === 10 && /^02\d{8}$/.test(phone)) return true;
        return false;
      }

      // 지역번호 031~070 (10자리)
      if (phone.length === 10) {
        if (/^0(3[1-9]|4[1-4]|5[1-5]|6[1-4])\d{7}$/.test(phone)) return true; // 031~064
        if (/^0(505|70)\d{7}$/.test(phone)) return true; // 0505, 070
        return false;
      }

      return false;
    }

    // 고객센터 번호 (8자리)
    if (phone.length === 8) {
      if (/^1(588|577|566|544|522|661|644|600|833|855|899)\d{4}$/.test(phone)) return true;
      return false;
    }

    return false;
  };

  // 전화번호 입력 시 숫자만 허용하는 함수
  const handlePhoneInputChange = inputValue => {
    if (label === '전화번호') {
      // 숫자만 추출
      const numbersOnly = inputValue.replace(/[^\d]/g, '');
      // 최대 11자리까지만 허용
      const limitedValue = numbersOnly.slice(0, 11);
      setEditValue(limitedValue);
    } else {
      setEditValue(inputValue);
    }
  };

  // 변경 버튼 활성화 조건
  const isChangeButtonEnabled = () => {
    if (disabled) return false;

    // 이메일 필드인 경우 이메일 형식 검증
    if (label === '이메일') {
      return editValue.trim() !== '' && isValidEmail(editValue) && editValue !== value;
    }

    // 전화번호 필드인 경우 전화번호 형식 검증
    if (label === '전화번호') {
      return editValue.trim() !== '' && isValidPhone(editValue) && editValue !== value;
    }

    // 다른 필드는 기존 로직 유지 (값이 변경되었고 비어있지 않은 경우)
    return editValue.trim() !== '' && editValue !== value;
  };

  // 에러 메시지 표시 조건
  const showEmailError = label === '이메일' && editValue.trim() !== '' && !isValidEmail(editValue);
  const showPhoneError =
    label === '전화번호' && editValue.trim() !== '' && !isValidPhone(editValue);

  return (
    <div >
      <div className={styles.fieldRow}>
        <label htmlFor={label}>{label}</label>
        <input
          type="text"
          value={editValue}
          disabled={disabled}
          id={label}
          placeholder={label === '전화번호' ? '01012345678' : ''}
          style={{
            backgroundColor: disabled ? 'lightgray' : 'white',
            borderColor: showEmailError || showPhoneError ? 'red' : 'initial',
          }}
          onChange={e => handlePhoneInputChange(e.target.value)}
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
      </div>

      {/* 이메일 형식이 잘못된 경우 에러 메시지 표시 */}
      {showEmailError && (
        <div className={styles.errormess}>
          <p
            style={{
              color: 'red',
              fontSize: '10px',
              marginTop: '7px',
              fontWeight: 'bold',
              marginLeft: '80px',
            }}
          >
            올바른 이메일 형식을 입력해주세요.
          </p>
        </div>
      )}

      {/* 전화번호 형식이 잘못된 경우 에러 메시지 표시 */}
      {showPhoneError && (
        <div className={styles.errormess}>
          <p
            style={{
              color: 'red',
              fontSize: '10px',
              marginTop: '7px',
              fontWeight: 'bold',
              marginLeft: '80px',
            }}
          >
            올바른 전화번호 형식을 입력해주세요. (예: 01012345678)
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
