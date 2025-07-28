import React, { useState } from 'react';
import ModalWrapper from '../../../common/modals/ModalWrapper';
import Button from '../../../common/components/Button';
import axiosInstance from '../../../services/axios-config';
import styles from './NewPWModal.module.scss';
import useToast from '@/common/hooks/useToast';
import PWChangedModal from './PWChangedModal';

function NewPWModal({ authId, inputCode, onClose }) {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPWChangedModal, setShowPWChangedModal] = useState(false);
  const { showSuccess, showNegative } = useToast();

  const handleResetPassword = async () => {
    if (!newPassword || !confirmPassword) {
      showNegative('비밀번호를 모두 입력해주세요.');
      return;
    }

    if (newPassword !== confirmPassword) {
      showNegative('비밀번호가 일치하지 않습니다.');
      return;
    }

    if (newPassword.length < 8) {
      showNegative('비밀번호는 최소 8자 이상이어야 합니다.');
      return;
    }

    try {
      const res = await axiosInstance.post('/auth-service/auth/reset-password', {
        authId,
        inputCode,
        newPassword,
      });

      if (res.data.success) {
        showSuccess('비밀번호가 성공적으로 변경되었습니다.');
        setShowPWChangedModal(true);
      } else {
        showNegative(res.data.message || '비밀번호 변경에 실패했습니다.');
      }
    } catch (err) {
      showNegative(err.response?.data?.message || '비밀번호 변경 중 오류가 발생했습니다.');
    }
  };

  if (showPWChangedModal) {
    return <PWChangedModal onClose={onClose} />;
  }

  return (
    <ModalWrapper title="새 비밀번호 입력" onClose={onClose}>
      <div className={styles.container}>
        <div className={styles.new}>
          <label htmlFor="new-password">새 비밀번호</label>
          <input
            type="password"
            id="new-password"
            value={newPassword}
            onChange={e => setNewPassword(e.target.value)}
            placeholder="새 비밀번호를 입력하세요"
          />
        </div>

        <div className={styles.confirm}>
          <label htmlFor="confirm-password">비밀번호 확인</label>
          <input
            type="password"
            id="confirm-password"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            placeholder="비밀번호를 한 번 더 입력하세요"
          />
        </div>

        <Button type="button" variant="BASIC" onClick={handleResetPassword} className="confirm">
          비밀번호 변경
        </Button>
      </div>
    </ModalWrapper>
  );
}

export default NewPWModal;
