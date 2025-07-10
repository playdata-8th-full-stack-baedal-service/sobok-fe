import React from 'react';
import ModalWrapper from '@/common/modals/ModalWrapper';
import PasswordInput from './PasswordInput';

function WithdrawalModal({ onClose, onSubmit, loading }) {
  const [withdrawalPassword, setWithdrawalPassword] = React.useState('');
  const [showWithdrawalPassword, setShowWithdrawalPassword] = React.useState(false);
  const [error, setError] = React.useState('');

  const handleSubmit = async e => {
    e.preventDefault();

    if (!withdrawalPassword.trim()) {
      setError('비밀번호를 입력해주세요.');
      return;
    }

    setError('');

    try {
      const result = await onSubmit(withdrawalPassword);

      if (result?.error) {
        setError(result.error);
      } else if (result?.success) {
        // 성공 시 모달이 자동으로 닫힘
        onClose();
      }
    } catch (error) {
      setError('회원탈퇴 중 오류가 발생했습니다.');
    }
  };

  return (
    <ModalWrapper title="회원탈퇴" onClose={onClose} size="md">
      <div>
        <p style={{ color: '#666', marginBottom: '20px', lineHeight: '1.5' }}>
          회원탈퇴를 위해 비밀번호를 입력해주세요.
        </p>

        <form onSubmit={handleSubmit}>
          <PasswordInput
            value={withdrawalPassword}
            onChange={e => setWithdrawalPassword(e.target.value)}
            showPassword={showWithdrawalPassword}
            onTogglePassword={() => setShowWithdrawalPassword(!showWithdrawalPassword)}
            placeholder="비밀번호를 입력하세요"
            error={error}
            id="withdrawalPassword"
          />

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              background: '#dc3545',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              padding: '12px',
              fontSize: '16px',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'background 0.3s ease',
            }}
            onMouseOver={e => !loading && (e.target.style.background = '#c82333')}
            onMouseOut={e => !loading && (e.target.style.background = '#dc3545')}
          >
            {loading ? '탈퇴 중...' : '탈퇴하기'}
          </button>
        </form>
      </div>
    </ModalWrapper>
  );
}

export default WithdrawalModal;
