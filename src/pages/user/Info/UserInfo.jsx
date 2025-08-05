import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Divider } from '@mui/material';
import { editEmail, editPhone, lookupUser, sendAuthCode } from '../../../store/userInfoSlice';

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

  // 이메일 추가 모드 상태
  const [isAddingEmail, setIsAddingEmail] = useState(false);
  const [newEmail, setNewEmail] = useState('');

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

  // 이메일 변경/추가 API
  const handleEmailEdit = async (email, onFailRestore) => {
    if (email === userInfo.email) {
      return;
    }
    try {
      await dispatch(editEmail({ email })).unwrap();
      showSuccess(userInfo.email ? '이메일이 변경되었습니다.' : '이메일이 추가되었습니다.');
      setIsModified(true);
      setIsAddingEmail(false);
      setNewEmail('');
    } catch (err) {
      showNegative(err);
      setIsModified(true);
      if (typeof onFailRestore === 'function') {
        onFailRestore();
      }
    }
  };

  // 이메일 삭제
  const handleEmailDelete = () => {
    axiosInstance
      .patch('/user-service/user/deleteEmail')
      .then(() => {
        showSuccess('이메일이 삭제되었습니다.');
        setIsModified(true);
      })
      .catch(() => showNegative('이메일 삭제에 실패했습니다.'));
  };

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

  const handleWithdrawal = useCallback(
    async password => {
      setLoadingState(prev => ({ ...prev, withdrawalLoading: true }));
      try {
        if (!password || password.trim() === '') {
          return { error: '비밀번호를 입력해주세요.' };
        }
        const isValidPassword = await verifyPassword(password);
        if (isValidPassword) {
          return { success: true };
        } else {
          showNegative('비밀번호가 올바르지 않습니다.');
          setIsWithdrawalModalOpen(false);
          return { error: '비밀번호가 올바르지 않습니다.' };
        }
      } catch (error) {
        showNegative('비밀번호 검증 중 오류가 발생했습니다.');
        setIsWithdrawalModalOpen(false);
        return { error: '비밀번호 검증 중 오류가 발생했습니다.' };
      } finally {
        setLoadingState(prev => ({ ...prev, withdrawalLoading: false }));
      }
    },
    [showNegative]
  );

  const handleWithdrawalClick = useCallback(() => {
    setIsWithdrawalModalOpen(true);
  }, []);

  const handleCloseWithdrawalModal = useCallback(() => {
    setIsWithdrawalModalOpen(false);
  }, []);

  const handleCancelEmailAdd = () => {
    setIsAddingEmail(false);
    setNewEmail('');
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
          {!userInfo.socialUser && (
            <EditableField label="아이디" value={userInfo.loginId || ''} disabled />
          )}
          <EditableField
            label="전화번호"
            value={targetPhone || userInfo.phone || ''}
            onEditClick={handlePhoneEdit}
            onDeleteClick={msg => showNegative(msg)}
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

          {/* 이메일 영역 */}
          {userInfo.email ? (
            <EditableField
              label="이메일"
              value={userInfo.email || ''}
              onEditClick={handleEmailEdit}
              onDeleteClick={handleEmailDelete}
              disabled={false}
              showDeleteButton
            />
          ) : isAddingEmail ? (
            <div className={styles.fieldRow}>
              <label>이메일</label>
              <input
                type="text"
                value={newEmail}
                onChange={e => setNewEmail(e.target.value)}
              />
              <Button
                type="button"
                onClick={() =>
                  handleEmailEdit(newEmail, () => {
                    setNewEmail('');
                  })
                }
              >
                추가
              </Button>
              <Button
                type="button"
                onClick={handleCancelEmailAdd}
              >
                취소
              </Button>
            </div>
          ) : (
            <Button type="button" onClick={() => setIsAddingEmail(true)}>
              이메일 추가하기
            </Button>
          )}
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

      {!userInfo.socialUser && (
        <Button className={styles.withdrawalButton} type="button" onClick={handleWithdrawalClick}>
          회원 탈퇴
        </Button>
      )}

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