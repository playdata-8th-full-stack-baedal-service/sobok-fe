import React from 'react';
import ModalWrapper from '@/common/modals/ModalWrapper';
import PasswordInput from './PasswordInput';
import PWChangedModal from '@/pages/auth/FindPW/PWChangedModal';
import styles from './PasswordChangeModal.module.scss';

function PasswordChangeModal({ onClose, onSubmit, loading }) {
  const [newPassword, setNewPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [showNewPassword, setShowNewPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const [error, setError] = React.useState('');
  const [showPWChangedModal, setShowPWChangedModal] = React.useState(false);

  const handleSubmit = async e => {
    e.preventDefault();

    if (!newPassword.trim()) {
      setError('새 비밀번호를 입력해주세요.');
      return;
    }

    if (!confirmPassword.trim()) {
      setError('새 비밀번호 확인을 입력해주세요.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('새 비밀번호와 확인 비밀번호가 일치하지 않습니다.');
      return;
    }

    setError('');

    try {
      const result = await onSubmit({ newPassword, confirmPassword });

      if (result?.error) {
        setError(result.error);
      } else if (result?.success) {
        // 성공 시 PWChangedModal 표시
        setShowPWChangedModal(true);
      }
    } catch (err) {
      setError('비밀번호 변경 중 오류가 발생했습니다.');
    }
  };

  if (showPWChangedModal) {
    return <PWChangedModal onClose={onClose} showSimpleClose />;
  }

  return (
    <ModalWrapper title="비밀번호 변경" onClose={onClose} size="md">
      <div className={styles.formselection}>
        <p className={styles.description}>새로운 비밀번호를 입력해주세요.</p>

        <form onSubmit={handleSubmit}>
          <PasswordInput
            value={newPassword}
            onChange={e => setNewPassword(e.target.value)}
            showPassword={showNewPassword}
            onTogglePassword={() => setShowNewPassword(!showNewPassword)}
            placeholder="새 비밀번호를 입력하세요"
            id="newPassword"
          />

          <PasswordInput
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            showPassword={showConfirmPassword}
            onTogglePassword={() => setShowConfirmPassword(!showConfirmPassword)}
            placeholder="새 비밀번호를 다시 입력하세요"
            error={error}
            id="confirmPassword"
          />

          <div className={styles.requirements}>
            <p className={styles.requirementsTitle}>비밀번호 요구사항:</p>
            <ul className={styles.requirementsList}>
              <li>최소 8자 이상</li>
              <li>대문자, 소문자, 숫자, 특수문자 포함</li>
              <li>기존 비밀번호와 다른 비밀번호</li>
            </ul>
          </div>

          <button type="submit" disabled={loading} className={styles.submitButton}>
            {loading ? '변경 중...' : '변경'}
          </button>
        </form>
      </div>
    </ModalWrapper>
  );
}

export default PasswordChangeModal;
