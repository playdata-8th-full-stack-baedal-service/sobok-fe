import React, { useState } from 'react';
import ModalWrapper from '../../../../common/modals/ModalWrapper';
import styles from './DeleteConfilmModal.module.scss';
import axiosInstance from '../../../../services/axios-config';

function RecoveryConfirmModal({ onClose, id }) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRecover = async id => {
    setIsLoading(true);
    setError('');
    try {
      const response = await axiosInstance.post(`/auth-service/auth/recover/${id}`);
      console.log(response.data);
      if (response.data.success) {
        return response.data.message;
      } 
      setError('복구 중 오류가 발생했다면 이게 뜹니다.');
    } catch (error) {
      setError('복구 관련 에러가 발생했다면 이게 뜹니다', error);
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
