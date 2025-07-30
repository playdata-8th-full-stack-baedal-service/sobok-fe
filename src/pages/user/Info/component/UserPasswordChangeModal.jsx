import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { editUserPassword, setErrorMessage } from '../../../../store/userInfoSlice';
import ModalWrapper from '../../../../common/modals/ModalWrapper';
import Button from '../../../../common/components/Button';
import PasswordInput from './PasswordInput';
import { isPasswordValid } from '../../../../common/utils/authUtils';
import styles from './UserPasswordChangeModal.module.scss';
import useToast from '@/common/hooks/useToast';

function UserPasswordChangeModal({ onClose }) {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword1, setShowPassword1] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);

  const dispatch = useDispatch();
  const { errorMessage } = useSelector(state => state.userInfo);
  const { showSuccess, showNegative } = useToast();

  const isButtonEnabled =
    newPassword &&
    confirmPassword &&
    newPassword.length >= 8 &&
    confirmPassword.length >= 8 &&
    newPassword === confirmPassword &&
    isPasswordValid(newPassword) &&
    isPasswordValid(confirmPassword);

  const handleSubmit = async () => {
    if (!isButtonEnabled) {
      dispatch(setErrorMessage('비밀번호 변경 요구사항을 충족하지 않습니다.'));
      return;
    }

    try {
      await dispatch(editUserPassword({ password: newPassword })).unwrap();
      showSuccess('비밀번호가 변경되었습니다.');
      onClose(); // 모달 닫기
    } catch (err) {
      showNegative('비밀번호 변경에 실패했습니다.');
    }
  };

  return (
    <ModalWrapper title="비밀번호 변경" onClose={onClose} size="md">
      <div className={styles.passwordChangeModal}>
        <p className={styles.passwordchangetitle}>새로운 비밀번호를 입력해주세요.</p>

        <PasswordInput
          value={newPassword}
          onChange={e => setNewPassword(e.target.value)}
          placeholder="새 비밀번호를 입력하세요"
          showPassword={showPassword1}
          onTogglePassword={() => setShowPassword1(prev => !prev)}
          hideLabel={true}
        />

        <PasswordInput
          value={confirmPassword}
          onChange={e => setConfirmPassword(e.target.value)}
          placeholder="새 비밀번호를 다시 입력하세요"
          showPassword={showPassword2}
          onTogglePassword={() => setShowPassword2(prev => !prev)}
          hideLabel={true}
        />

        {errorMessage && (
          <p style={{ color: 'red', marginBottom: '10px', fontSize: '10px' }}>{errorMessage}</p>
        )}

        <div className={styles.vaildpasswordcard}>
          <p>비밀번호 요구사항:</p>
          <ul className={styles.detailpasswordvaild}>
            <li>최소 8자 이상</li>
            <li>대문자, 소문자, 숫자, 특수문자 포함</li>
            <li>기존 비밀번호와 다른 비밀번호</li>
          </ul>
        </div>

        <Button type="button" onClick={handleSubmit} className={styles.changebutton}>
          변경
        </Button>
      </div>
    </ModalWrapper>
  );
}

UserPasswordChangeModal.propTypes = {
  onClose: PropTypes.func.isRequired,
};

export default UserPasswordChangeModal;
