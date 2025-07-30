/* eslint-disable consistent-return */
import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Divider } from '@mui/material';
import { editEmail, editPhone, lookupUser, sendAuthCode } from '../../../store/userInfoSlice';

// 컴포넌트 import
import UserInfoHeader from './component/UserInfoHeader';
import ProfileImage from './component/ProfileImage';
import EditableField from './component/EditableField';
import AddrList from './component/Address/AddrList';
import WithdrawalModal from './component/Delete/WithdrawalModal';
import AuthCodeEditableField from './component/AuthCodeEditableField';

import { useNavigate } from 'react-router-dom';
import useToast from '@/common/hooks/useToast';
import axiosInstance from '../../../services/axios-config';
import Button from '../../../common/components/Button';
import styles from './UserInfo.module.scss';

function UserInfo() {
  const { userInfo } = useSelector(state => state.userInfo);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { showSuccess, showNegative } = useToast();
  const [targetPhone, setTargetPhone] = useState('');
  const [isModified, setIsModified] = useState(true);
  const [timer, setTimer] = useState(180);
  const [loadingState, setLoadingState] = useState({
    withdrawalLoading: false,
  });
  const [isWithdrawalModalOpen, setIsWithdrawalModalOpen] = useState(false);

  // 유저 정보 조회
  useEffect(() => {
    const fetchUserInfo = async () => {
      if (!isModified) return;

      try {
        await dispatch(lookupUser()).unwrap();
        setIsModified(false);
      } catch (err) {
        showNegative('접근권한이 없습니다.');
        navigate('/');
      }
    };

    fetchUserInfo();
  }, [dispatch, isModified, navigate, showNegative]);

  // 인증번호 타이머
  useEffect(() => {
    if (timer === null || targetPhone === '') return;
    const interval = setInterval(() => {
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
      showNegative(err);
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

  // 비밀번호 검증 함수
  const verifyPassword = async password => {
    try {
      const response = await axiosInstance.post('/auth-service/auth/verify-password', {
        password,
      });
      return response.data.success;
    } catch (error) {
      return false;
    }
  };

  // 회원탈퇴 처리 함수 - 비밀번호 검증만 담당
  const handleWithdrawal = useCallback(
    async password => {
      setLoadingState(prev => ({ ...prev, withdrawalLoading: true }));
      try {
        // 비밀번호가 비어있으면 실패
        if (!password || password.trim() === '') {
          return { error: '비밀번호를 입력해주세요.' };
        }

        // 직접 비밀번호 검증 API 호출
        const isValidPassword = await verifyPassword(password);

        if (isValidPassword) {
          return { success: true };
        } else {
          // 비밀번호가 틀렸을 때 토스트 메시지와 함께 모달 닫기
          showNegative('비밀번호가 올바르지 않습니다.');
          setIsWithdrawalModalOpen(false);
          return { error: '비밀번호가 올바르지 않습니다.' };
        }
      } catch (error) {
        // API 에러 발생시에도 토스트 메시지와 함께 모달 닫기
        showNegative('비밀번호 검증 중 오류가 발생했습니다.');
        setIsWithdrawalModalOpen(false);
        return { error: '비밀번호 검증 중 오류가 발생했습니다.' };
      } finally {
        setLoadingState(prev => ({ ...prev, withdrawalLoading: false }));
      }
    },
    [showNegative]
  );

  // 회원탈퇴 모달 열기
  const handleWithdrawalClick = useCallback(() => {
    setIsWithdrawalModalOpen(true);
  }, []);

  // 회원탈퇴 모달 닫기
  const handleCloseWithdrawalModal = useCallback(() => {
    setIsWithdrawalModalOpen(false);
  }, []);

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

      {isWithdrawalModalOpen && (
        <WithdrawalModal
          onClose={handleCloseWithdrawalModal}
          onSubmit={handleWithdrawal}
          loading={loadingState.withdrawalLoading}
        />
      )}
    </div>
  );
}

export default UserInfo;
