import React, { useState } from 'react';
import ModalWrapper from '../../../common/modals/ModalWrapper';
import styles from './RecoveryConfirmModal.module.scss';
import axiosInstance from '../../../services/axios-config';
import { useNavigate } from 'react-router-dom';
import useToast from '@/common/hooks/useToast';

function RecoveryConfirmModal({ onClose, id, password }) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { showSuccess } = useToast();

  const handleRecover = async () => {
    setIsLoading(true);
    setError('');
    try {
      const response = await axiosInstance.post(`/auth-service/auth/recover/${id}`, {
        password, // 로그인 시 입력했던 비밀번호 사용
      });
      if (response.data.success) {
        showSuccess('복구 되었습니다. 다시 로그인 해주세요.');
        onClose();
        navigate('/');
      } else {
        setError(response.data.message || '복구 중 오류가 발생했습니다.');
      }
    } catch (error) {
      setError(error.response?.data?.message || '복구 관련 에러가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ModalWrapper onClose={onClose} title="계정 복구 확인" size="md">
      <div className={styles.RecoveryConfirmModal}>
        <p className={styles.description}>사용자님의 계정은 휴먼모드입니다.</p>
        <p className={styles.description}>계정을 복구 하시겠습니까?</p>
        <div className={styles.buttonGroup}>
          <button type="button" onClick={onClose} disabled={isLoading} className={styles.cancel}>
            돌아가기
          </button>
          <button
            type="button"
            onClick={handleRecover}
            disabled={isLoading}
            className={styles.buttondot}
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
