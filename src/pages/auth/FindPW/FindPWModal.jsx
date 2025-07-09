import React, { useState, useRef } from 'react';
import { useDispatch } from 'react-redux';
import axiosInstance from '../../../services/axios-config';
import { resetSMSAuth } from '../../../store/smsAuthSlice';
import ModalWrapper from '../../../common/modals/ModalWrapper';
import IDInput from '../SignIn/components/IDInput';
import PhoneVerification from '../../../common/forms/PhoneVerification';
import useSignInHandlers from '../SignIn/hooks/useSignInHandlers';
import Button from '../../../common/components/Button';
import NewPWModal from './NewPWModal';
import styles from './FindPWModal.module.scss';

function FindPWModal({ onClose }) {
  const [id, setId] = useState('');
  const [phone, setPhone] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [authId, setAuthId] = useState(null);
  const [showNewPWModal, setShowNewPWModal] = useState(false);

  const idInputRef = useRef();
  const dispatch = useDispatch();

  const { handleKeyDown } = useSignInHandlers({
    id,
    password: '',
    setError: () => {},
    idInputRef,
  });

  const handleCloseWithReset = () => {
    setPhone('');
    setVerificationCode('');
    setAuthId(null);
    dispatch(resetSMSAuth());
    onClose();
  };

  const handleRequestVerification = async () => {
    try {
      const res = await axiosInstance.post('/auth-service/auth/verification', {
        loginId: id,
        userPhoneNumber: phone,
      });
      if (res.data.success) {
        alert('인증번호가 전송되었습니다.');
        setAuthId(res.data.data);
      } else {
        alert(res.data.message);
      }
    } catch (e) {
      alert(e.response?.data?.message || '인증 요청 실패');
    }
  };

  const handleVerifyCode = async () => {
    try {
      const res = await axiosInstance.post('/auth-service/sms/verify', {
        phoneNumber: phone,
        inputCode: verificationCode,
      });
      if (res.data.success) {
        alert('인증이 완료되었습니다.');
        setShowNewPWModal(true);
      } else {
        alert(res.data.message || '인증 실패');
      }
    } catch (e) {
      alert(e.response?.data?.message || '인증 확인 실패');
    }
  };

  if (showNewPWModal) {
    return <NewPWModal onClose={onClose} authId={authId} />;
  }

  return (
    <ModalWrapper title="비밀번호 찾기" onClose={handleCloseWithReset}>
      <div className={styles.container}>
        <IDInput
          id={id}
          setId={setId}
          rememberMe={false}
          setRememberMe={() => {}}
          onKeyDown={handleKeyDown}
          inputRef={idInputRef}
          showLabel={false}
          showRememberMe={false}
          labelText=""
          placeholder="아이디를 입력해 주세요."
        />

        <PhoneVerification
          phone={phone}
          verificationCode={verificationCode}
          onPhoneChange={e => setPhone(e.target.value)}
          onVerificationCodeChange={e => setVerificationCode(e.target.value)}
          showLabel={false}
          showButton={false}
          onRequestVerification={handleRequestVerification}
        />

        <Button type="button" variant="BASIC" onClick={handleVerifyCode} className="confirm">
          인증번호 확인
        </Button>
      </div>
    </ModalWrapper>
  );
}

export default FindPWModal;
