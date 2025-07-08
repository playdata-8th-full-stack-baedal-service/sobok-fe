import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { sendSMSCode, verifySMSCode } from '../../store/smsAuthSlice';
import Input from '../../common/components/Input';
import Button from '../../common/components/Button';
import styles from './PhoneVerification.module.scss';

function PhoneVerification({
  phone,
  verificationCode,
  onPhoneChange,
  onVerificationCodeChange,
  wrapperClassName = '',
  showLabel = true,
  phonePlaceholder = '01012345678',
  codePlaceholder = '인증번호를 입력하세요',
  sendButtonText = '인증하기',
  confirmButtonText = '확인',
}) {
  const dispatch = useDispatch();
  const { isVerified, isCodeSent, error: smsError } = useSelector(state => state.smsAuth);

  const handleSendSMS = () => {
    const phoneRegex = /^\d{11}$/;
    if (!phoneRegex.test(phone)) {
      alert('전화번호는 하이픈 없이 11자리 숫자로 입력해주세요.');
      return;
    }
    dispatch(sendSMSCode(phone));
  };

  const handleVerifySMS = () => {
    if (!verificationCode.trim()) {
      alert('인증번호를 입력해주세요.');
      return;
    }
    dispatch(
      verifySMSCode({
        phoneNumber: phone,
        inputCode: verificationCode.trim(),
      })
    );
  };

  return (
    <div className={`${styles.phoneWrapper} ${wrapperClassName}`}>
      <div className={styles.inputWithButton}>
        <Input label="전화번호" required error={smsError} showLabel={showLabel}>
          <div className={styles.inputButtonGroup}>
            <input
              type="text"
              id="phone"
              value={phone}
              onChange={onPhoneChange}
              placeholder={phonePlaceholder}
              className={smsError ? styles.inputError : ''}
            />
            <Button type="button" variant="BASIC" onClick={handleSendSMS} disabled={isCodeSent}>
              {isCodeSent ? '전송됨' : sendButtonText}
            </Button>
          </div>
        </Input>
      </div>

      <div className={styles.inputWithButton}>
        <Input
          label="인증번호"
          required
          success={isVerified && '인증이 완료되었습니다.'}
          showLabel={showLabel}
        >
          <div className={styles.inputButtonGroup}>
            <input
              type="text"
              id="phonevalid"
              value={verificationCode}
              onChange={onVerificationCodeChange}
              placeholder={codePlaceholder}
            />
            <Button type="button" variant="BASIC" onClick={handleVerifySMS}>
              {confirmButtonText}
            </Button>
          </div>
        </Input>
      </div>

      {smsError && <p className={`${styles.message} ${styles.error}`}>{smsError}</p>}
    </div>
  );
}

export default PhoneVerification;
