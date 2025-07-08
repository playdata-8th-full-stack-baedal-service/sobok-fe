import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { resetSMSAuth } from '../../../store/smsAuthSlice';
import { API_BASE_URL } from '../../../services/host-config';
import ModalWrapper from '../../../common/modals/ModalWrapper';
import Button from '../../../common/components/Button';
import styles from './YourIDIsModal.module.scss';

function YourIDIsModal({ onClose, phone, verificationCode }) {
  const [loginIds, setLoginIds] = useState([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchLoginIds = async () => {
      try {
        const response = await axios.post(
          `${API_BASE_URL}/auth-service/auth/findLoginId`,
          {
            userPhoneNumber: phone,
            userInputCode: verificationCode,
          },
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );

        if (response.data.success && response.data.data) {
          setLoginIds(response.data.data.map(item => item.loginId));
        } else {
          alert(response.data.message || '아이디를 찾을 수 없습니다.');
          handleCloseWithReset();
        }
      } catch (err) {
        alert(err.response?.data?.message || '아이디 조회 중 오류가 발생했습니다.');
        handleCloseWithReset();
      }
    };

    fetchLoginIds();
  }, [phone, verificationCode]);

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
              <Button text="로그인 하기" type="MODALBASIC" onClick={handleLogin} />
              <Button text="홈화면 가기" type="MODALBASIC" onClick={handleGoHome} />
            </div>
          </>
        ) : (
          <p>아이디를 조회 중입니다...</p>
        )}
      </div>
    </ModalWrapper>
  );
}

export default YourIDIsModal;
