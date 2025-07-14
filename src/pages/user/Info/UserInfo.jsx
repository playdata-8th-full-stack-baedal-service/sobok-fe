/* eslint-disable no-alert */
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { editEmail, editPhone, lookupUser, sendAuthCode } from '../../../store/userInfoSlice';
import UserInfoHeader from './component/UserInfoHeader';
import ProfileImage from './component/ProfileImage';
import EditableField from './component/EditableField';
import AddrList from './component/AddrList';
import { openModal } from '../../../store/modalSlice';
import styles from './UserInfo.module.scss';
import Button from '../../../common/components/Button';

function UserInfo() {
  const { userInfo } = useSelector(state => state.userInfo);
  const dispatch = useDispatch();

  const [targetPhone, setTargetPhone] = useState('');
  const [isModified, setIsModified] = useState(true);

  // 유저 정보 조회
  useEffect(() => {
    const fetchUserInfo = async () => {
      if (!isModified) return;

      try {
        await dispatch(lookupUser({ password: 'Password123!' })).unwrap();
        setIsModified(false);
      } catch (err) {
        alert(err);
      }
    };

    fetchUserInfo();
  }, [dispatch, isModified]);

  // 전화번호 수정
  const handlePhoneEdit = async phone => {
    if (phone === userInfo.phone) {
      return;
    }

    try {
      setTargetPhone(phone);
      await dispatch(sendAuthCode({ phone })).unwrap();
      alert('인증번호가 발송되었습니다.');
    } catch (err) {
      alert(err);
      setTargetPhone('');
      setIsModified(true);
    }
  };

  // 전화번호 인증
  const handlePhoneConfirm = async userInputCode => {
    try {
      await dispatch(editPhone({ phone: targetPhone, userInputCode })).unwrap();
      alert('전화번호가 변경되었습니다.');
      setIsModified(true);
    } catch (err) {
      alert(err);
      setIsModified(true);
    } finally {
      setTargetPhone('');
    }
  };

  // 이메일 수정
  const handleEmailEdit = async email => {
    if (email === userInfo.email) {
      return;
    }

    try {
      await dispatch(editEmail({ email })).unwrap();
      alert('이메일이 변경되었습니다.');
      setIsModified(true);
    } catch (err) {
      alert(err);
      setIsModified(true);
    }
  };

  const handleWithdrawalClick = () => {
    dispatch(openModal('WITHDRAWAL'));
  };

  return (
    <div className={styles.userInfoContainer}>
      <UserInfoHeader />

      <div className={styles.userInfoContent}>
        <div className={styles.leftSection}>
          <ProfileImage />
        </div>

        <div className={styles.rightSection}>
          <EditableField label="닉네임" value={userInfo.nickname || ''} disabled />
          <EditableField label="아이디" value={userInfo.loginId || ''} disabled />
          <EditableField
            label="전화번호"
            value={userInfo.phone || ''}
            onEditClick={handlePhoneEdit}
          />
          {targetPhone && (
            <EditableField
              label="인증번호"
              value={userInfo.authCode || ''}
              onEditClick={handlePhoneConfirm}
            />
          )}
          <EditableField
            label="이메일"
            value={userInfo.email || ''}
            onEditClick={handleEmailEdit}
          />
        </div>
      </div>

      <div className={styles.addrSection}>
        <AddrList />
      </div>

      <Button className={styles.withdrawalButton} type="button" onClick={handleWithdrawalClick}>
        회원 탈퇴
      </Button>
    </div>
  );
}

export default UserInfo;
