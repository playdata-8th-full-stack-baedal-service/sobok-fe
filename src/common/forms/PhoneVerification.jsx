import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { sendSMSCode, verifySMSCode } from '../../store/smsAuthSlice';
import Input from '../../common/components/Input';
import Button from '../../common/components/Button';

function PhoneVerification({
  phone,
  verificationCode,
  onPhoneChange,
  onVerificationCodeChange,
  wrapperClassName = '',
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

      {smsError && <p className="message error">{smsError}</p>}

      <div className="phone-group">
        <label htmlFor="phonevalid">
          인증 번호 <span className="required">*</span>
        </label>
        <div className="phonecomp">
          <Input
            id="phonevalid"
            type="text"
            value={verificationCode}
            onChange={onVerificationCodeChange}
          />
          <Button type="button" variant="BASIC" onClick={handleVerifySMS} text="확인" />
        </div>
        {isVerified && <p className="message success">인증이 완료되었습니다.</p>}
      </div>
    </div>
  );
}

export default PhoneVerification;
