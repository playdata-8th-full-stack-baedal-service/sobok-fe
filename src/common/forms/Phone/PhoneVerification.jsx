import React, { useEffect, useRef, useState } from 'react';
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

  // 타이머 상태
  const [timer, setTimer] = useState(0); // 남은 초
  const timerRef = useRef(null);

  // 인증 요청 시 타이머 시작
  const startTimer = () => {
    setTimer(180);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimer(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // 인증 요청 핸들러
  const defaultHandleSendSMS = () => {
    const phoneRegex = /^\d{11}$/;
    if (!phoneRegex.test(phone)) {
      showNegative('전화번호는 하이픈 없이 11자리 숫자로 입력해주세요.');
      return;
    }
    dispatch(sendSMSCode(phone));
    startTimer();
  };

  const handleSendSMS = onRequestVerification || defaultHandleSendSMS;

  // 재전송 버튼 클릭 시
  const handleResend = () => {
    dispatch(sendSMSCode(phone));
    startTimer();
  };

  // 타이머가 0이 되면 입력창 활성화
  useEffect(() => {
    if (timer === 0 && timerRef.current) {
      clearInterval(timerRef.current);
    }
  }, [timer]);

  // 인증 성공/실패 시 타이머 정리
  useEffect(() => {
    if (!isCodeSent) {
      setTimer(0);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  }, [isCodeSent]);

  // 언마운트 시 타이머 정리
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // 타이머 포맷 (mm:ss)
  const formatTime = sec => {
    const m = String(Math.floor(sec / 60)).padStart(2, '0');
    const s = String(sec % 60).padStart(2, '0');
    return `${m}:${s}`;
  };

  const handleVerifySMS = () => {
    if (!verificationCode.trim()) {
      showNegative('인증번호를 입력해주세요.');
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
              name="phone"
              value={phone}
              onChange={onPhoneChange}
              placeholder="전화번호를 입력하세요."
              className={smsError ? styles.inputError : ''}
              disabled={isCodeSent}
            />
            {/* 인증요청 버튼, 타이머, 재전송 버튼 분리 */}
            {!isCodeSent && (
              <Button
                type="button"
                variant="BASIC"
                onClick={handleSendSMS}
                className={styles.verifynumberbutton}
              >
                인증요청
              </Button>
            )}
            {isCodeSent && timer > 0 && (
              <div
                className={styles.timerText}
                style={{ minWidth: 80, textAlign: 'center', fontWeight: 'bold' }}
              >
                {formatTime(timer)}
              </div>
            )}
            {isCodeSent && timer === 0 && (
              <Button
                type="button"
                variant="BASIC"
                onClick={handleResend}
                className={styles.verifynumberbutton}
              >
                재전송
              </Button>
            )}
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
              placeholder="인증번호를 입력하세요."
            />
            {showButton && (
              <Button
                type="button"
                variant="BASIC"
                onClick={handleVerifySMS}
                className={styles.checkbuttonnumber}
              >
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
