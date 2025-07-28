import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { editUserPassword, setErrorMessage } from '../../../../store/userInfoSlice';
import ModalWrapper from '../../../../common/modals/ModalWrapper';
import Button from '../../../../common/components/Button';
import PasswordInput from './PasswordInput';
import PWChangedModal from '../../../auth/FindPW/PWChangedModal';
import { isPasswordValid } from '../../../../common/utils/authUtils';
import styles from '../UserInfo.module.scss';

function UserPasswordChangeModal({ onClose }) {
  const [complete, setComplete] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const dispatch = useDispatch();

  const { errorMessage } = useSelector(state => state.userInfo);

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

    dispatch(editUserPassword({ password: newPassword }));
    if (!errorMessage) {
      setComplete(true);
    }
  };

  return complete ? (
    <PWChangedModal onClose={onClose} showSimpleClose={complete} />
  ) : (
    <ModalWrapper title="비밀번호 변경" onClose={onClose} size="md">
      <div className={styles.passwordChangeModal}>
        <p className={styles.passwordchangetitle}>새로운 비밀번호를 입력해주세요.</p>

        <PasswordInput
          value={newPassword}
          onChange={e => setNewPassword(e.target.value)}
          placeholder="새 비밀번호를 입력하세요"
        />

        <PasswordInput
          value={confirmPassword}
          onChange={e => setConfirmPassword(e.target.value)}
          placeholder="새 비밀번호를 다시 입력하세요"
        />

        {errorMessage && <p style={{ color: 'red', marginBottom: '10px', fontSize: '10px'}}>{errorMessage}</p>}

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
