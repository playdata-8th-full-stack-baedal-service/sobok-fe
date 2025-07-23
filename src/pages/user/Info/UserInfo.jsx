/* eslint-disable consistent-return */
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Divider } from '@mui/material';
import { editEmail, editPhone, lookupUser, sendAuthCode } from '../../../store/userInfoSlice';
import UserInfoHeader from './component/UserInfoHeader';
import ProfileImage from './component/ProfileImage';
import EditableField from './component/EditableField';
import AddrList from './component/AddrList';
import { openModal } from '../../../store/modalSlice';
import styles from './UserInfo.module.scss';
import Button from '../../../common/components/Button';
import AuthCodeEditableField from './component/AuthCodeEditableField';
import { useNavigate } from 'react-router-dom';
import useToast from '@/common/hooks/useToast';

function UserInfo() {
  const { userInfo } = useSelector(state => state.userInfo);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { showSuccess, showNegative, showInfo } = useToast();

  const [targetPhone, setTargetPhone] = useState('');
  const [isModified, setIsModified] = useState(true);
  const [timer, setTimer] = useState(180);

  // 유저 정보 조회
  useEffect(() => {
    const fetchUserInfo = async () => {
      if (!isModified) return;

      try {
        await dispatch(lookupUser()).unwrap();
        setIsModified(false);
      } catch (err) {
        showError('접근권한이 없습니다.');
        navigate('/');
      }
    };

    fetchUserInfo();
  }, [dispatch, isModified]);

  // 인증번호 타이머
  useEffect(() => {
    if (timer === null || targetPhone === '') return;
    const interval = setInterval(() => {
      console.log(timer);
      setTimer(prev => prev - 1);
    }, 1000);

    return () => {
      if (timer <= 0) {
        setTimer(null);
        setTargetPhone('');
        setIsModified(true);
      }
      clearInterval(interval);
    };
  }, [targetPhone, timer]);

  // 전화번호 수정
  const handlePhoneEdit = async phone => {
    if (phone === userInfo.phone) {
      return;
    }

    try {
      setTargetPhone(phone);
      await dispatch(sendAuthCode({ phone })).unwrap();
      showSuccess('인증번호가 발송되었습니다.');
      setTimer(180);
    } catch (err) {
      showNegative(err);
      setTargetPhone('');
      setIsModified(true);
    }
  };

  // 전화번호 인증
  const handlePhoneConfirm = async userInputCode => {
    try {
      await dispatch(editPhone({ phone: targetPhone, userInputCode })).unwrap();
      showSuccess('전화번호가 변경되었습니다.');
      setIsModified(true);
    } catch (err) {
      alshowNegativeert(err);
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
      showSuccess('이메일이 변경되었습니다.');
      setIsModified(true);
    } catch (err) {
      showNegative(err);
      setIsModified(true);
    }
  };

  const handleWithdrawalClick = () => {
    // 회원 탈퇴 모달 열기
    dispatch(openModal({}));
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
            value={targetPhone || userInfo.phone || ''}
            onEditClick={handlePhoneEdit}
            disabled={targetPhone !== ''}
          />
          {targetPhone && (
            <AuthCodeEditableField
              label="인증번호"
              value={userInfo.authCode || ''}
              onEditClick={handlePhoneConfirm}
              timer={timer}
            />
          )}
          <EditableField
            label="이메일"
            value={userInfo.email || ''}
            onEditClick={handleEmailEdit}
          />
        </div>
      </div>

      <Divider />

      <div className={styles.addrSection}>
        <AddrList
          addressList={userInfo.addresses}
          onAddressUpdate={() => setIsModified(true)}
          onAddressesChange={() => setIsModified(true)}
          onAddressDelete={() => setIsModified(true)}
        />
      </div>

      <Button className={styles.withdrawalButton} type="button" onClick={handleWithdrawalClick}>
        회원 탈퇴
      </Button>
    </div>
  );
}

export default UserInfo;
