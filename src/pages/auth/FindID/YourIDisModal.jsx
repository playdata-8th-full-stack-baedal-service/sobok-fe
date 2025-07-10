import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { resetSMSAuth } from '../../../store/smsAuthSlice';
import ModalWrapper from '../../../common/modals/ModalWrapper';
import Button from '../../../common/components/Button';
import styles from './YourIDIsModal.module.scss';

function YourIDIsModal({ onClose, loginIds = [] }) {
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
    <ModalWrapper title="아이디 확인" onClose={handleCloseWithReset}>
      <div className={styles.container}>
        {loginIds.length > 0 ? (
          <>
            <p className={styles.label}>사용자님의 아이디는</p>
            <p className={styles.userid}>
              <strong>{loginIds[0]}</strong> 입니다.
            </p>
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
          </>
        ) : (
          <p>아이디를 불러올 수 없습니다.</p>
        )}
      </div>
    </ModalWrapper>
  );
}

export default YourIDIsModal;
