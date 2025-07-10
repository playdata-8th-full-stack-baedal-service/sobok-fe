import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { checkEmail, clearEmailCheck } from '@/store/authSlice';
import Input from '../../components/Input';
import Button from '../../components/Button';
import styles from './EmailSection.module.scss';

function EmailSection({
  emailLocal,
  emailDomain,
  customDomain,
  isCustomDomain,
  onEmailLocalChange,
  onDomainChange,
  onCustomDomainChange,
  getFullEmail,
}) {
  const dispatch = useDispatch();
  const { loading, emailCheckMessage, emailCheckError } = useSelector(state => state.auth);

  const domainOptions = [
    'gmail.com',
    'naver.com',
    'daum.net',
    'yahoo.com',
    'hotmail.com',
    '직접입력',
  ];

  const handleDomainChange = e => {
    const selected = e.target.value;
    dispatch(clearEmailCheck());
    onDomainChange(selected);
  };

  const handleEmailLocalChange = e => {
    dispatch(clearEmailCheck());
    onEmailLocalChange(e);
  };

  const handleCustomDomainChange = e => {
    dispatch(clearEmailCheck());
    onCustomDomainChange(e);
  };

  const handleEmailCheck = async () => {
    const fullEmail = getFullEmail();
    if (!fullEmail) {
      alert('이메일을 완전히 입력해주세요.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(fullEmail)) {
      alert('올바른 이메일 형식이 아닙니다.');
      return;
    }

    try {
      await dispatch(checkEmail(fullEmail)).unwrap();
    } catch (error) {
      console.error('이메일 중복 확인 실패:', error);
    }
  };

  return (
    <Input
      label="이메일 (선택)"
      className={styles.emailGroup}
      success={emailCheckMessage}
      error={emailCheckError}
    >
      <div className={styles.emailInputRow}>
        <input
          type="text"
          value={emailLocal}
          onChange={handleEmailLocalChange}
          placeholder="이메일"
        />
        <span>@</span>
        <select value={isCustomDomain ? '직접입력' : emailDomain} onChange={handleDomainChange}>
          {domainOptions.map(domain => (
            <option key={domain} value={domain}>
              {domain}
            </option>
          ))}
        </select>
        <Button type="button" variant="BASIC" onClick={handleEmailCheck} loading={loading}>
          중복확인
        </Button>
      </div>
      {isCustomDomain && (
        <input
          type="text"
          value={customDomain}
          onChange={handleCustomDomainChange}
          placeholder="도메인을 입력하세요 (예: company.com)"
          className={styles.customDomainInput}
        />
      )}
      {getFullEmail() && <p className={styles.emailPreview}>완성된 이메일: {getFullEmail()}</p>}
    </Input>
  );
}

export default EmailSection;
