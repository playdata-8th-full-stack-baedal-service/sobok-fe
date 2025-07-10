import React from 'react';
import ModalWrapper from '../../../common/modals/ModalWrapper';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { resetSMSAuth } from '../../../store/smsAuthSlice';
import Button from '../../../common/components/Button';
import styles from './PWChangedModal.module.scss';

function PWChangedModal({ onClose }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleCloseWithReset = () => {
    dispatch(resetSMSAuth());
    onClose();
  };

  const handleLogin = () => {
    navigate('/auth/signin');
    handleCloseWithReset();
  };

  const handleGoHome = () => {
    navigate('/');
    handleCloseWithReset();
  };

  return (
    <ModalWrapper title=" " onClose={onClose}>
      <div className={styles.container}>
        <div className={styles.header}>비밀번호 변경이 완료되었습니다.</div>
        <div className={styles.buttonGroup}>
          <Button
            text="로그인 하기"
            type="button"
            variant="BASIC"
            className="confirm"
            onClick={handleLogin}
          />
          <Button
            text="홈화면 가기"
            type="button"
            variant="BASIC"
            className="confirm"
            onClick={handleGoHome}
          />
        </div>
      </div>
    </ModalWrapper>
  );
}

export default PWChangedModal;
