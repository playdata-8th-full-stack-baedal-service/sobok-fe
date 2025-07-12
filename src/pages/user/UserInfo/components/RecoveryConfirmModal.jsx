import React, { useState } from 'react';
import PropTypes from 'prop-types';
import ModalWrapper from '../../../../common/modals/ModalWrapper';
import styles from './DeleteConfilmModal.module.scss';

function RecoveryConfirmModal({ onClose, id }) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRecover = async () => {
    setIsLoading(true);
    setError('');
    try {
      const response = await fetch(`/auth-service/auth/recover/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      if (data.success) {
        alert('계정이 정상적으로 복구되었습니다.');
        onClose();
        // 필요시 navigate('/') 등 리다이렉트 추가
      } else {
        setError(data.message || '복구에 실패했습니다.');
      }
    } catch (err) {
      setError('복구 요청 중 오류가 발생했습니다.');
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

RecoveryConfirmModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired,
};

export default RecoveryConfirmModal;
