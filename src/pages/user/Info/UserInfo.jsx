/* eslint-disable consistent-return */
import React, { useEffect, useState, useCallback } from 'react';
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
  const [loadingState, setLoadingState] = useState({
    withdrawalLoading: false
  });

  // 유저 정보 조회
  useEffect(() => {
    const fetchUserInfo = async () => {
      if (!isModified) return;

      try {
        await dispatch(lookupUser()).unwrap();
        setIsModified(false);
      } catch (err) {
        showNegative('접근권한이 없습니다.'); // showError를 showNegative로 수정
        navigate('/');
      }
    };

    fetchUserInfo();
  }, [dispatch, isModified, navigate, showNegative]);

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
      showNegative(err); // alshowNegativeert를 showNegative로 수정
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

  // 회원탈퇴 처리 함수 (비밀번호 확인만 하고 toast는 표시하지 않음)
  const handleWithdrawal = useCallback(async (password) => {
    setLoadingState(prev => ({ ...prev, withdrawalLoading: true }));
    try {
      // 여기서 비밀번호 검증 API만 호출
      // 예: await dispatch(verifyPassword({ password })).unwrap();
      
      // 성공시에는 toast를 표시하지 않고 success만 반환
      return { success: true };
    } catch (error) {
      // 비밀번호가 틀렸을 때만 에러 toast 표시
      showNegative(error.message || '비밀번호가 올바르지 않습니다.');
      return { error: error.message || '비밀번호가 올바르지 않습니다.' };
    } finally {
      setLoadingState(prev => ({ ...prev, withdrawalLoading: false }));
    }
  }, [showNegative]);

  const handleWithdrawalClick = useCallback(() => {
    dispatch(
      openModal({
        type: 'WITHDRAWAL',
        props: {
          onSubmit: handleWithdrawal,
          loading: loadingState.withdrawalLoading,
        },
      })
    );
  }, [dispatch, handleWithdrawal, loadingState.withdrawalLoading]);

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