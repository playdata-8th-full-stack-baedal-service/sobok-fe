import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { sendSMSCode, verifySMSCode } from '../../../../../../store/smsAuthSlice';
import FormInput from '../common/FormInput';
import Button from '../common/Button';

function PhoneVerification({ phone, verificationCode, onPhoneChange, onVerificationCodeChange }) {
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
    <>
      <FormInput label="전화번호" required error={smsError}>
        <div className="phoneflex">
          <input
            type="text"
            id="phone"
            name="phone"
            value={phone}
            onChange={onPhoneChange}
            placeholder="01012345678"
            required
          />
          <Button type="button" variant="secondary" onClick={handleSendSMS} disabled={isCodeSent}>
            {isCodeSent ? '전송됨' : '인증하기'}
          </Button>
        </div>
      </FormInput>

      {isCodeSent && (
        <FormInput label="인증 번호" success={isVerified ? '인증이 완료되었습니다.' : ''}>
          <div className="phoneflex">
            <input
              type="text"
              id="phonevalid"
              value={verificationCode}
              onChange={onVerificationCodeChange}
            />
            <Button type="button" variant="secondary" onClick={handleVerifySMS}>
              확인
            </Button>
          </div>
        </FormInput>
      )}
    </>
  );
}

export default PhoneVerification;
