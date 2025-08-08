import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { checkEmail, clearEmailCheck, setInvalidEmailFormat } from '@/store/authSlice';
import Input from '../../components/Input';
import styles from './EmailSection.module.scss';
import useToast from '@/common/hooks/useToast';

function EmailSection({
  emailLocal,
  emailDomain,
  customDomain,
  isCustomDomain,
  onEmailLocalChange,
  onDomainChange,
  onCustomDomainChange,
  getFullEmail,
  disabled,
}) {
  const dispatch = useDispatch();
  const { showNegative } = useToast();
  const { emailCheckMessage, emailCheckError } = useSelector(state => state.auth);

  const domainOptions = [
    'gmail.com',
    'naver.com',
    'daum.net',
    'yahoo.com',
    'hotmail.com',
    '직접입력',
  ];

  const emailTimer = useRef(null);

  // 이메일 주소 변경 시 중복 확인 디바운스 처리
  useEffect(() => {
    if (emailTimer.current) clearTimeout(emailTimer.current);

    const fullEmail = getFullEmail();
    const emailRegex = /^(?!\.)(?!.*\.\.)[A-Za-z0-9._%+-]+(?<!\.)@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    if (!fullEmail) {
      dispatch(clearEmailCheck());
      return;
    }

    if (!emailRegex.test(fullEmail)) {
      dispatch(setInvalidEmailFormat('사용할 수 없는 이메일 형식입니다.'));
      return;
    }

    emailTimer.current = setTimeout(() => {
      dispatch(checkEmail(fullEmail));
    }, 800);

    return () => clearTimeout(emailTimer.current);
  }, [emailLocal, emailDomain, customDomain, isCustomDomain]);

  const handleDomainChange = e => {
    dispatch(clearEmailCheck());
    onDomainChange(e.target.value);
  };

  const handleEmailLocalChange = e => {
    const value = e.target.value.replace(/[^A-Za-z0-9._%+-]/g, '');

    // Show error toast if invalid characters were removed
    if (value !== e.target.value) {
      showNegative('도메인에는 영문, 숫자, 점(.), 하이픈(-)만 사용할 수 있습니다.');
    }

    dispatch(clearEmailCheck());
    onEmailLocalChange({ ...e, target: { ...e.target, value } });
  };

  const handleCustomDomainChange = e => {
    const value = e.target.value.replace(/[^A-Za-z0-9.-]/g, '');
    dispatch(clearEmailCheck());
    onCustomDomainChange({ ...e, target: { ...e.target, value } });
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
          disabled={disabled}
        />
        <span>@</span>
        <select value={isCustomDomain ? '직접입력' : emailDomain} onChange={handleDomainChange}>
          {domainOptions.map(domain => (
            <option key={domain} value={domain}>
              {domain}
            </option>
          ))}
        </select>
      </div>

      {isCustomDomain && (
        <input
          type="text"
          value={customDomain}
          onChange={handleCustomDomainChange}
          placeholder="도메인을 입력하세요 (예: company.com)"
          className="custom-domain-input"
          disabled={disabled}
        />
      )}

      {getFullEmail() && <p className={styles.emailPreview}>완성된 이메일: {getFullEmail()}</p>}
    </Input>
  );
}

export default EmailSection;
