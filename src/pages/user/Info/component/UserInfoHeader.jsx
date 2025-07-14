/* eslint-disable react/function-component-definition */
import React from 'react';
import { useDispatch } from 'react-redux';
import Button from '../../../../common/components/Button';
import { openModal } from '../../../../store/modalSlice';
import styles from '../UserInfo.module.scss';

const UserInfoHeader = () => {
  const dispatch = useDispatch();

  const handlePasswordChangeClick = () => {
    dispatch(openModal('USER_INFO_PASSWORD_CHANGE'));
  };

  return (
    <div className={styles.userInfoHeader}>
      <h1>회원정보 조회</h1>
      <Button type="button" onClick={handlePasswordChangeClick}>
        비밀번호 변경
      </Button>
    </div>
  );
};

export default UserInfoHeader;
