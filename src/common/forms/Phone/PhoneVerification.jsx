import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { sendSMSCode, verifySMSCode } from '../../../store/smsAuthSlice';
import Input from '../../components/Input';
import Button from '../../components/Button';
import styles from './PhoneVerification.module.scss';

function PhoneVerification({
  phone,
  verificationCode,
  onPhoneChange,
  onVerificationCodeChange,
  wrapperClassName = '',
  showLabel = true,
  showButton = true,
  onRequestVerification,
}) {
  const dispatch = useDispatch();
  const { isVerified, isCodeSent, error: smsError } = useSelector(state => state.smsAuth);

  const defaultHandleSendSMS = () => {
    const phoneRegex = /^\d{11}$/;
    if (!phoneRegex.test(phone)) {
      alert('전화번호는 하이픈 없이 11자리 숫자로 입력해주세요.');
      return;
    }
    dispatch(sendSMSCode(phone));
  };

  const handleSendSMS = onRequestVerification || defaultHandleSendSMS;

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
    <div className={wrapperClassName}>
      <div className="phone-group">
        <label htmlFor="phone">
          전화번호 <span className="required">*</span>
        </label>
        <div className="phonecomp">
          <Input
            id="phone"
            type="text"
            value={phone}
            name='phone'
            onChange={onPhoneChange}
            placeholder="01012345678"
            className={smsError ? 'input-error' : ''}
          />
          <Button
            type="button"
            variant="BASIC"
            onClick={handleSendSMS}
            disabled={isCodeSent}
            text={isCodeSent ? '전송됨' : '인증하기'}
          />
        </div>
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
              placeholder="인증번호를 입력하세요."
            />
            {showButton && (
              <Button type="button" variant="BASIC" onClick={handleVerifySMS}>
                인증확인
              </Button>
            )}
          </div>
        </Input>
      </div>

      {smsError && <p className={`${styles.message} ${styles.error}`}>{smsError}</p>}
    </div>
  );
}

export default PhoneVerification;
