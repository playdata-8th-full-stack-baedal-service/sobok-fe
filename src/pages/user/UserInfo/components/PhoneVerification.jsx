import React from 'react';
import styles from '../UserInfoPage.module.scss';

function PhoneVerification({
  editPhone,
  onPhoneChange,
  showVerificationInput,
  verificationCode,
  onVerificationCodeChange,
  onSendVerificationCode,
  onVerifyCode,
  smsLoading,
  phoneLoading,
}) {
  return (
    <>
      <input
        type="text"
        value={editPhone}
        onChange={onPhoneChange}
        placeholder="전화번호를 입력하세요 (01012345678)"
        className={styles.editInput}
        maxLength={11}
      />
      {!showVerificationInput ? (
        <button
          type="button"
          onClick={onSendVerificationCode}
          disabled={smsLoading}
          className={styles.confirmBtn}
        >
          {smsLoading ? '발송 중...' : '인증하기'}
        </button>
      ) : (
        <div className={styles.verificationSection}>
          <input
            type="text"
            value={verificationCode}
            onChange={onVerificationCodeChange}
            placeholder="인증번호를 입력하세요"
            className={styles.verificationInput}
            maxLength={6}
          />
          <button
            type="button"
            onClick={onVerifyCode}
            disabled={smsLoading || phoneLoading}
            className={styles.confirmBtn}
          >
            {smsLoading || phoneLoading ? '확인 중...' : '확인'}
          </button>
        </div>
      )}
    </>
  );
}

export default PhoneVerification;
