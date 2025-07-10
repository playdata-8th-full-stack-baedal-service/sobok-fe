import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { resetSMSAuth } from '../../../store/smsAuthSlice';
import { openModal } from '../../../store/modalSlice';
import ModalWrapper from '../../../common/modals/ModalWrapper';
import PhoneVerification from '../../../common/forms/Phone/PhoneVerification';
import styles from './FindIDModal.module.scss';
import Button from '../../../common/components/Button';
import axios from 'axios';
import { API_BASE_URL } from '../../../services/host-config';

function FindIDModal({ onClose }) {
  const [phone, setPhone] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const dispatch = useDispatch();

  const handleFindID = async () => {
    if (!phone || !verificationCode) {
      alert('전화번호와 인증번호를 모두 입력해주세요.');
      return;
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/auth-service/auth/findLoginId`, {
        userPhoneNumber: phone,
        userInputCode: verificationCode,
      });

      if (response.data.success && response.data.data) {
        const loginIds = response.data.data.map(item => item.loginId);

        onClose();

        setTimeout(() => {
          dispatch(
            openModal({
              type: 'YOUR_ID',
              props: {
                loginIds,
              },
            })
          );
        }, 0);
      } else {
        alert(response.data.message || '아이디를 찾을 수 없습니다.');
      }
    } catch (err) {
      alert(err.response?.data?.message || '아이디 조회 중 오류가 발생했습니다.');
    }
  };

  // 모달 닫히면 필드 리셋
  const handleCloseWithReset = () => {
    setPhone('');
    setVerificationCode('');
    dispatch(resetSMSAuth());
    onClose();
  };

  const handlePhoneChange = e => {
    setPhone(e.target.value);
  };

  const handleCodeChange = e => {
    setVerificationCode(e.target.value);
  };

  return (
    <ModalWrapper title="아이디 찾기" onClose={handleCloseWithReset}>
      <div className={styles.container}>
        <PhoneVerification
          phone={phone}
          verificationCode={verificationCode}
          onPhoneChange={handlePhoneChange}
          onVerificationCodeChange={handleCodeChange}
          showLabel={false}
          showButton={false}
        />
      </div>

      <Button type="button" variant="BASIC" onClick={handleFindID} className="confirm">
        아이디 찾기
      </Button>
    </ModalWrapper>
  );
}

export default FindIDModal;
