import React, { useState, useRef } from 'react';
import { useDispatch } from 'react-redux';
import axiosInstance from '../../../services/axios-config';
import { resetSMSAuth } from '../../../store/smsAuthSlice';
import ModalWrapper from '../../../common/modals/ModalWrapper';
import IDInput from '../SignIn/components/IDInput';
import Input from '../../../common/components/Input';
import Button from '../../../common/components/Button';
import NewPWModal from './NewPWModal';
import styles from './FindPWModal.module.scss';
import useToast from '@/common/hooks/useToast';

const { showSuccess, showNegative, showInfo } = useToast();

function FindPWModal({ onClose }) {
  const [id, setId] = useState('');
  const [phone, setPhone] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [authId, setAuthId] = useState(null);
  const [showNewPWModal, setShowNewPWModal] = useState(false);
  const [timer, setTimer] = useState(0);
  const timerRef = useRef(null);

  const idInputRef = useRef();
  const dispatch = useDispatch();

  const handleCloseWithReset = () => {
    setPhone('');
    setVerificationCode('');
    setAuthId(null);
    dispatch(resetSMSAuth());
    onClose();
  };

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

  const formatTime = sec => {
    const m = String(Math.floor(sec / 60)).padStart(2, '0');
    const s = String(sec % 60).padStart(2, '0');
    return `${m}:${s}`;
  };

  const handleRequestVerification = async () => {
    try {
      const res = await axiosInstance.post('/auth-service/auth/verification', {
        loginId: id,
        userPhoneNumber: phone,
      });
      if (res.data.success) {
        showInfo('인증번호가 전송되었습니다.');
        setAuthId(res.data.data);
        startTimer();
      } else {
        showNegative(res.data.message);
      }
    } catch (e) {
      showNegative(e.response?.data?.message || '인증 요청 실패');
    }
  };

  const handleVerifyCode = async () => {
    try {
      const res = await axiosInstance.post('/auth-service/sms/verify', {
        phoneNumber: phone,
        inputCode: verificationCode,
      });
      if (res.data.success) {
        showSuccess('인증이 완료되었습니다.');
        setShowNewPWModal(true);
      } else {
        showNegative(res.data.message || '인증 실패');
      }
    } catch (e) {
      showNegative(e.response?.data?.message || '인증 확인 실패');
    }
  };

  if (showNewPWModal) {
    return <NewPWModal onClose={onClose} authId={authId} inputCode={verificationCode} />;
  }

  return (
    <ModalWrapper title="비밀번호 찾기" onClose={handleCloseWithReset}>
      <div className={styles.container}>
        <IDInput
          id={id}
          setId={setId}
          rememberMe={false}
          setRememberMe={() => {}}
          inputRef={idInputRef}
          showLabel={false}
          showRememberMe={false}
          labelText=""
          placeholder="아이디를 입력해 주세요."
        />

        <Input label="전화번호" required showLabel={false}>
          <div className={styles.inputButtonGroup}>
            <input
              type="text"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              placeholder="전화번호를 입력하세요."
              disabled={timer > 0}
            />
            {timer === 0 ? (
              <Button type="button" variant="BASIC" onClick={handleRequestVerification}>
                인증요청
              </Button>
            ) : (
              <div className={styles.timerText}>{formatTime(timer)}</div>
            )}
          </div>
        </Input>

        <Input label="인증번호" required showLabel={false}>
          <div className={styles.inputButtonGroup}>
            <input
              type="text"
              value={verificationCode}
              onChange={e => setVerificationCode(e.target.value)}
              placeholder="인증번호를 입력하세요."
            />
          </div>
        </Input>

        <Button type="button" variant="BASIC" onClick={handleVerifyCode} className="confirm">
          인증번호 확인
        </Button>
      </div>
    </ModalWrapper>
  );
}

export default FindPWModal;
