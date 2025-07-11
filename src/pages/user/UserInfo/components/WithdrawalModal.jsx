import React from 'react';
import PropTypes from 'prop-types';
import ModalWrapper from '../../../../common/modals/ModalWrapper';
import PasswordInput from './PasswordInput';
import DeleteConfilmModal from './DeleteConfilmModal';
import styles from './DeleteConfilmModal.module.scss';

function WithdrawalModal({ onClose, onSubmit, loading }) {
  const [withdrawalPassword, setWithdrawalPassword] = React.useState('');
  const [showWithdrawalPassword, setShowWithdrawalPassword] = React.useState(false);
  const [localError, setLocalError] = React.useState('');
  const [showConfirmModal, setShowConfirmModal] = React.useState(false);

  const handleSubmit = async e => {
    e.preventDefault();

    if (!withdrawalPassword.trim()) {
      setLocalError('비밀번호를 입력해주세요.');
      return;
    }

    setLocalError('');

    try {
      const result = await onSubmit(withdrawalPassword);

      if (result?.error) {
        setLocalError(result.error);
      } else if (result?.success) {
        setShowConfirmModal(true);
      }
    } catch (err) {
      setLocalError('회원탈퇴 중 오류가 발생했습니다.');
    }
  };

  const handleCloseConfirmModal = () => {
    setShowConfirmModal(false);
    onClose();
  };

  if (showConfirmModal) {
    return <DeleteConfilmModal onClose={handleCloseConfirmModal} password={withdrawalPassword} />;
  }

  return (
    <ModalWrapper title="회원탈퇴" onClose={onClose} size="lg">
      <div>
        <p className={styles.withdrawalDescription}>회원탈퇴를 위해 비밀번호를 입력해주세요.</p>

        <form onSubmit={handleSubmit} className={styles.withdrawalForm}>
          <PasswordInput
            value={withdrawalPassword}
            onChange={e => setWithdrawalPassword(e.target.value)}
            showPassword={showWithdrawalPassword}
            onTogglePassword={() => setShowWithdrawalPassword(!showWithdrawalPassword)}
            placeholder="비밀번호를 입력하세요"
            error={localError}
            id="withdrawalPassword"
          />

          <button type="submit" disabled={loading} className={styles.withdrawalButton}>
            {loading ? '확인 중...' : '확인'}
          </button>
        </form>
      </div>
    </ModalWrapper>
  );
}

WithdrawalModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
};

export default WithdrawalModal;
