import React from 'react';
import ModalWrapper from '@/common/modals/ModalWrapper';
import PasswordInput from './PasswordInput';
import styles from './PasswordConfirmModal.module.scss';

function PasswordConfirmModal({ onClose, onSubmit, loading }) {
  const [password, setPassword] = React.useState('');
  const [showPassword, setShowPassword] = React.useState(false);
  const [error, setError] = React.useState('');

  const handleSubmit = async e => {
    e.preventDefault();

    if (!password.trim()) {
      setError('비밀번호를 입력해주세요.');
      return;
    }

    setError('');

    try {
      await onSubmit(password);
      // 성공 시 모달이 자동으로 닫힘 (Redux에서 처리)
    } catch (error) {
      setError(error || '비밀번호 확인에 실패했습니다.');
    }
  };

  return (
    <ModalWrapper title="비밀번호 확인" onClose={onClose} size="md">
      <div>
        <p className={styles.description}>회원정보를 확인하기 위해 비밀번호를 입력해주세요.</p>

        <form onSubmit={handleSubmit} className={styles.formselection}>
          <PasswordInput
            value={password}
            onChange={e => setPassword(e.target.value)}
            showPassword={showPassword}
            onTogglePassword={() => setShowPassword(!showPassword)}
            placeholder="비밀번호를 입력하세요"
            error={error}
          />

          <button type="submit" disabled={loading} className={styles.submitButton}>
            {loading ? '확인 중...' : '확인'}
          </button>
        </form>
      </div>
    </ModalWrapper>
  );
}

export default PasswordConfirmModal;
