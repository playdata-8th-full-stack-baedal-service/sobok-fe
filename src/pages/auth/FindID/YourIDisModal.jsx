// YourIDIsModal.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../../../services/host-config';
import ModalWrapper from '../../../common/modals/ModalWrapper';
import styles from './YourIDIsModal.module.scss';
import { data } from 'react-router-dom';

function YourIDIsModal({ onClose, phone, verificationCode }) {
  const [loginIds, setLoginIds] = useState([]);
  const [error, setError] = useState(null);

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

        console.log(response);

        if (response.data.success && response.data.data) {
          setLoginIds(response.data.data.map(item => item.loginId));
        } else {
          alert(response.data.message || '아이디를 찾을 수 없습니다.');
          onClose();
        }
      } catch (err) {
        alert(err.response?.data?.message || '아이디 조회 중 오류가 발생했습니다.');
        onClose();
      }
    };

    fetchLoginIds();
  }, [phone, verificationCode, onClose]);

  return (
    <ModalWrapper title="아이디 확인" onClose={onClose}>
      <div className={styles.container}>
        {loginIds.length > 0 ? (
          <>
            <p className={styles.label}>찾은 아이디 목록:</p>
            <ul className={styles.idList}>
              {loginIds.map((id, index) => (
                <li key={index}>{id}</li>
              ))}
            </ul>
          </>
        ) : (
          <p>아이디를 조회 중입니다...</p>
        )}
      </div>
    </ModalWrapper>
  );
}

export default YourIDIsModal;
