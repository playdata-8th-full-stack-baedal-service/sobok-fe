import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { resetSMSAuth } from '../../../store/smsAuthSlice';
import { openModal } from '../../../store/modalSlice';
import ModalWrapper from '../../../common/modals/ModalWrapper';
import PhoneVerification from '../../../common/forms/PhoneVerification';
import styles from './FindIDModal.module.scss';
import Button from '../../../common/components/Button';

function FindIDModal({ onClose }) {
  const [phone, setPhone] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const dispatch = useDispatch();

  const handleFindID = () => {
    if (!phone || !verificationCode) {
      alert('전화번호와 인증번호를 모두 입력해주세요.');
      return;
    }

    onClose();

    setTimeout(() => {
      dispatch(
        openModal({
          type: 'YOUR_ID',
          props: {
            phone,
            verificationCode,
          },
        })
      );
    }, 0);
  };

  // 모달 외부 또는 X 버튼 클릭 시 닫음
  const handleCloseWithReset = () => {
    setPhone('');
    setVerificationCode('');
    dispatch(resetSMSAuth());
    onClose();
  };

  return (
    <ModalWrapper title="아이디 찾기" onClose={handleCloseWithReset}>
      <div className={styles.content}>
        <PhoneVerification
          phone={phone}
          verificationCode={verificationCode}
          onPhoneChange={e => setPhone(e.target.value)}
          onVerificationCodeChange={e => setVerificationCode(e.target.value)}
          wrapperClassName={styles.phoneVerification}
        />
      </div>

      <Button type="button" variant="BASIC" onClick={handleFindID}>
        아이디 찾기
      </Button>
    </ModalWrapper>
  );
}

export default FindIDModal;
