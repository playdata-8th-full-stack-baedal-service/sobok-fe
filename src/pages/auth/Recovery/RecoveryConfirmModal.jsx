import React, { useState } from 'react';
import ModalWrapper from '../../../common/modals/ModalWrapper';
import styles from './RecoveryConfirmModal.module.scss';
import axiosInstance from '../../../services/axios-config';
import { useNavigate } from 'react-router-dom';

function RecoveryConfirmModal({ onClose, id }) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRecover = async () => {
    setIsLoading(true);
    setError('');
    try {
      // id를 반드시 사용하여 복구 API 호출
      const response = await axiosInstance.post(`/auth-service/auth/recover/${id}`);
      if (response.data.success) {
        alert('복구가 완료되었습니다. 다시 로그인 하십시요');
        onClose();
        navigate('/');
      } else {
        setError('복구 중 오류가 발생했습니다.');
      }
    } catch (error) {
      setError('복구 관련 에러가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ModalWrapper onClose={onClose} title="계정 복구 확인" size="lg">
      <div>
        <p className={styles.description}>
          사용자님의 계정은 휴먼모드입니다. 계정을 복구 하시겠습니까?
        </p>
        <div className={styles.buttonGroup}>
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className={`${styles.button} ${styles.cancel}`}
          >
            돌아가기
          </button>
          <button
            type="button"
            onClick={handleRecover}
            disabled={isLoading}
            className={styles.button}
          >
            {isLoading ? '복구 중...' : '복구하기'}
          </button>
        </div>
        {error && <p className={styles.error}>{error}</p>}
      </div>
    </ModalWrapper>
  );
}

export default RecoveryConfirmModal;
