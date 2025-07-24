import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import ModalWrapper from '../../../../common/modals/ModalWrapper';
import { deleteUser } from '../../../../store/authSlice';
import useToast from '@/common/hooks/useToast'; // toast hook import
import styles from './DeleteConfilmModal.module.scss';

function DeleteConfilmModal({ onClose, password }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { showSuccess, showNegative } = useToast(); // toast 함수들 가져오기
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const withdrawalLoading = useSelector(state => state.auth.loading);

  const handleWithdrawal = async () => {
    setIsLoading(true);
    setError('');
    try {
      const resultAction = await dispatch(deleteUser({ password }));
      if (deleteUser.fulfilled.match(resultAction)) {
        // 성공시 toast 표시하고 페이지 이동
        showSuccess('회원탈퇴가 완료되었습니다.');
        onClose();
        navigate('/');
      } else {
        setError(resultAction.payload || '회원탈퇴에 실패했습니다.');
        showNegative(resultAction.payload || '회원탈퇴에 실패했습니다.');
      }
    } catch (err) {
      const errorMessage = '회원탈퇴 중 오류가 발생했습니다.';
      setError(errorMessage);
      showNegative(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ModalWrapper title="회원탈퇴 확인" onClose={onClose} size="lg">
      <div className={styles.formcheck}>
        <p className={styles.description}>정말로 탈퇴하시겠습니까?</p>
        <p className={styles.warning}>탈퇴 후에는 계정을 복구할 수 없습니다.</p>
        <div className={styles.buttonGroup}>
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading || withdrawalLoading}
            className={`${styles.button} ${styles.cancel}`}
          >
            돌아가기
          </button>
          <button
            type="button"
            onClick={handleWithdrawal}
            disabled={isLoading || withdrawalLoading}
            className={styles.buttonone}
          >
            {isLoading || withdrawalLoading ? '탈퇴 중...' : '탈퇴하기'}
          </button>
        </div>
        {error && <p className={styles.error}>{error}</p>}
      </div>
    </ModalWrapper>
  );
}

DeleteConfilmModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  password: PropTypes.string.isRequired,
};

export default DeleteConfilmModal;