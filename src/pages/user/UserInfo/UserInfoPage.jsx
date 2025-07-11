import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { lookupUser } from '@/store/authSlice';
import { sendSMSCode, verifySMSCode, clearSMSAuth } from '@/store/smsAuthSlice';
import { openModal, closeModal } from '@/store/modalSlice';
import axiosInstance from '@/services/axios-config';
import styles from './UserInfoPage.module.scss';
import AddrList from './Unit/AddrList';
import {
  EditableField,
  ProfileImage,
  LoadingSpinner,
  ErrorDisplay,
  PhoneVerification,
} from './components';
import DuplicateCheckInput from '@/common/components/DuplicateCheckInput';
import ModalController from '@/common/modals/ModalController';

function UserInfoPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userInfo, userInfoLoading, userInfoError } = useSelector(state => state.auth);
  const { loading: smsLoading, error: smsError, isVerified } = useSelector(state => state.smsAuth);

  // 편집 상태
  const [editState, setEditState] = useState({
    isEditingEmail: false,
    isEditingPhone: false,
    editEmail: '',
    editPhone: '',
    verificationCode: '',
    showVerificationInput: false,
  });

  // 로딩 상태
  const [loadingState, setLoadingState] = useState({
    passwordChangeLoading: false,
    withdrawalLoading: false,
    emailLoading: false,
    phoneLoading: false,
  });

  // 에러 상태
  const [errorState, setErrorState] = useState({
    emailError: '',
    phoneError: '',
  });

  // 사용자 정보 및 주소 상태
  const [localUserInfo, setLocalUserInfo] = useState(null);
  const [addresses, setAddresses] = useState([]);

  // 유틸리티 함수들
  const validatePassword = useCallback(password => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (password.length < minLength) return '비밀번호는 최소 8자 이상이어야 합니다.';
    if (!hasUpperCase) return '비밀번호에 대문자가 포함되어야 합니다.';
    if (!hasLowerCase) return '비밀번호에 소문자가 포함되어야 합니다.';
    if (!hasNumbers) return '비밀번호에 숫자가 포함되어야 합니다.';
    if (!hasSpecialChar) return '비밀번호에 특수문자가 포함되어야 합니다.';
    return '';
  }, []);

  const validatePhoneNumber = useCallback(phone => {
    const phoneRegex = /^01[0-9]{9}$/;
    return phoneRegex.test(phone);
  }, []);

  const validateEmail = useCallback(email => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }, []);

  // 상태 업데이트 함수들
  const updateEditState = useCallback(updates => {
    setEditState(prev => ({ ...prev, ...updates }));
  }, []);

  const updateLoadingState = useCallback(updates => {
    setLoadingState(prev => ({ ...prev, ...updates }));
  }, []);

  const updateErrorState = useCallback(updates => {
    setErrorState(prev => ({ ...prev, ...updates }));
  }, []);

  // 모달 관련 함수들
  const handlePasswordConfirm = useCallback(
    async password => {
      try {
        await dispatch(lookupUser({ password })).unwrap();
        // 비밀번호 확인 성공 시 모달 닫기
        dispatch(closeModal());
      } catch (error) {
        // 에러를 throw하여 모달에서 처리하도록 함
        throw error;
      }
    },
    [dispatch]
  );

  const handlePasswordChange = useCallback(
    async ({ newPassword, confirmPassword }) => {
      if (!newPassword.trim()) {
        return { error: '새 비밀번호를 입력해주세요.' };
      }

      if (!confirmPassword.trim()) {
        return { error: '새 비밀번호 확인을 입력해주세요.' };
      }

      const passwordValidationError = validatePassword(newPassword);
      if (passwordValidationError) {
        return { error: passwordValidationError };
      }

      if (newPassword !== confirmPassword) {
        return { error: '새 비밀번호와 확인 비밀번호가 일치하지 않습니다.' };
      }

      if (!window.confirm('비밀번호를 변경하시겠습니까?')) {
        return { cancelled: true };
      }

      updateLoadingState({ passwordChangeLoading: true });

      try {
        const response = await axiosInstance.patch('/auth-service/auth/edit-password', {
          newPassword,
        });

        if (response.data.success && response.data.status === 200) {
          return { success: true };
        }
        return { error: response.data.message || '비밀번호 변경에 실패했습니다.' };
      } catch (error) {
        return {
          error: error.response?.data?.message || '비밀번호 변경 중 오류가 발생했습니다.',
        };
      } finally {
        updateLoadingState({ passwordChangeLoading: false });
      }
    },
    [validatePassword, updateLoadingState]
  );

  const handleWithdrawal = useCallback(
    async withdrawalPassword => {
      if (!withdrawalPassword.trim()) {
        return { error: '비밀번호를 입력해주세요.' };
      }

      updateLoadingState({ withdrawalLoading: true });

      try {
        const response = await axiosInstance.delete('/auth-service/auth/delete', {
          data: { password: withdrawalPassword },
        });

        if (response.data.success && response.data.status === 200) {
          navigate('/');
          return { success: true };
        }
        return { error: response.data.message || '회원탈퇴에 실패했습니다.' };
      } catch (error) {
        return {
          error: error.response?.data?.message || '회원탈퇴 중 오류가 발생했습니다.',
        };
      } finally {
        updateLoadingState({ withdrawalLoading: false });
      }
    },
    [updateLoadingState, navigate]
  );

  // 프로필 사진 변경 처리
  const handlePhotoChange = useCallback(
    async file => {
      if (!file) return;

      try {
        console.log('프로필 사진 변경 시작:', file.name);

        // 1. 임시 토큰 발급
        const tempTokenResponse = await axiosInstance.get('/auth-service/auth/temp-token');
        const tempToken = tempTokenResponse.data.data;
        console.log('임시 토큰 발급 완료');

        // 2. Presigned URL 요청 (fetch로 변경)
        const params = new URLSearchParams({
          fileName: file.name,
          category: 'profile',
        });

        const presignedResponse = await fetch(
          `${axiosInstance.defaults.baseURL}/api-service/api/presign?${params}`,
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${tempToken}`,
              'Content-Type': 'application/json',
            },
          }
        );

        if (!presignedResponse.ok) {
          const errorText = await presignedResponse.text();
          console.error('Presigned URL 요청 실패:', presignedResponse.status, errorText);
          throw new Error(`Presigned URL 요청 실패: ${presignedResponse.status}`);
        }

        const presignedData = await presignedResponse.json();
        console.log('Presigned URL 응답:', presignedData);

        if (!presignedData.success) {
          throw new Error(presignedData.message || 'Presigned URL 생성 실패');
        }

        const presignedUrl = presignedData.data;
        console.log('Presigned URL 획득:', presignedUrl);

        // 3. S3에 파일 업로드
        console.log('S3 업로드 시작...');
        const uploadResponse = await fetch(presignedUrl, {
          method: 'PUT',
          body: file,
          headers: {
            'Content-Type': file.type,
          },
        });

        console.log('S3 업로드 응답:', uploadResponse.status, uploadResponse.statusText);

        if (!uploadResponse.ok) {
          const errorText = await uploadResponse.text();
          console.error('S3 업로드 실패:', uploadResponse.status, errorText);
          throw new Error(`S3 업로드 실패: ${uploadResponse.status} ${uploadResponse.statusText}`);
        }

        // 4. 업로드된 URL 추출
        const uploadedUrl = presignedUrl.split('?')[0];
        console.log('업로드된 URL:', uploadedUrl);

        // 5. 로컬 상태 업데이트
        setLocalUserInfo(prev => ({
          ...prev,
          profileImage: uploadedUrl,
        }));

        alert('프로필 사진이 성공적으로 변경되었습니다.');
        dispatch(closeModal());
      } catch (error) {
        console.error('프로필 사진 변경 실패:', error);
        alert(`프로필 사진 변경에 실패했습니다: ${error.message}`);
      }
    },
    [dispatch]
  );

  // 이메일 변경 처리
  const handleEmailChange = useCallback(async () => {
    if (!editState.editEmail.trim()) {
      updateErrorState({ emailError: '이메일을 입력해주세요.' });
      return;
    }

    if (!validateEmail(editState.editEmail)) {
      updateErrorState({ emailError: '올바른 이메일 형식을 입력해주세요.' });
      return;
    }

    updateLoadingState({ emailLoading: true });
    updateErrorState({ emailError: '' });

    try {
      const response = await axiosInstance.post('/user-service/user/editEmail', {
        email: editState.editEmail,
      });

      if (response.data.success && response.data.status === 200) {
        setLocalUserInfo(prev => ({ ...prev, email: editState.editEmail }));
        alert('이메일이 성공적으로 변경되었습니다.');
        updateEditState({ isEditingEmail: false });
      } else {
        updateErrorState({ emailError: response.data.message || '이메일 변경에 실패했습니다.' });
      }
    } catch (error) {
      updateErrorState({
        emailError: error.response?.data?.message || '이메일 변경 중 오류가 발생했습니다.',
      });
    } finally {
      updateLoadingState({ emailLoading: false });
    }
  }, [editState.editEmail, validateEmail, updateErrorState, updateLoadingState, updateEditState]);

  // 전화번호 변경 처리
  const handlePhoneChange = useCallback(async () => {
    // 인증번호 확인이 완료되지 않았으면 변경 불가
    if (!isVerified) {
      updateErrorState({ phoneError: '인증번호 확인을 완료해주세요.' });
      return;
    }

    updateLoadingState({ phoneLoading: true });
    updateErrorState({ phoneError: '' });

    try {
      const response = await axiosInstance.patch('/user-service/user/editPhone', {
        phone: editState.editPhone,
      });

      if (response.data.success && response.data.status === 200) {
        setLocalUserInfo(prev => ({ ...prev, phone: editState.editPhone }));
        alert('전화번호가 성공적으로 변경되었습니다.');
        updateEditState({
          isEditingPhone: false,
          showVerificationInput: false,
          verificationCode: '',
        });
        dispatch(clearSMSAuth());
      } else {
        updateErrorState({ phoneError: response.data.message || '전화번호 변경에 실패했습니다.' });
      }
    } catch (error) {
      updateErrorState({
        phoneError: error.response?.data?.message || '전화번호 변경 중 오류가 발생했습니다.',
      });
    } finally {
      updateLoadingState({ phoneLoading: false });
    }
  }, [
    editState.editPhone,
    isVerified,
    updateErrorState,
    updateLoadingState,
    updateEditState,
    dispatch,
  ]);

  const handleSendVerificationCode = useCallback(async () => {
    if (!editState.editPhone.trim()) {
      updateErrorState({ phoneError: '전화번호를 입력해주세요.' });
      return;
    }

    if (!validatePhoneNumber(editState.editPhone)) {
      updateErrorState({ phoneError: '올바른 전화번호 형식을 입력해주세요. (01012345678)' });
      return;
    }

    updateErrorState({ phoneError: '' });

    try {
      await dispatch(sendSMSCode(editState.editPhone)).unwrap();
      updateEditState({ showVerificationInput: true });
      alert('인증번호가 발송되었습니다.');
    } catch (error) {
      updateErrorState({ phoneError: error || 'SMS 전송에 실패했습니다.' });
    }
  }, [editState.editPhone, validatePhoneNumber, updateErrorState, updateEditState, dispatch]);

  const handleVerifyCode = useCallback(async () => {
    if (!editState.verificationCode.trim()) {
      updateErrorState({ phoneError: '인증번호를 입력해주세요.' });
      return;
    }

    updateErrorState({ phoneError: '' });

    try {
      await dispatch(
        verifySMSCode({
          phoneNumber: editState.editPhone,
          inputCode: editState.verificationCode,
        })
      ).unwrap();
    } catch (error) {
      updateErrorState({ phoneError: error || '인증에 실패했습니다.' });
    }
  }, [editState.verificationCode, editState.editPhone, updateErrorState, dispatch]);

  // 주소 관련 함수들
  const handleAddressUpdate = useCallback((addressId, updatedAddress) => {
    setAddresses(prevAddresses =>
      prevAddresses.map(addr => (addr.id === addressId ? { ...addr, ...updatedAddress } : addr))
    );
  }, []);

  const handleAddressDelete = useCallback(addressId => {
    setAddresses(prevAddresses => prevAddresses.filter(addr => addr.id !== addressId));
  }, []);

  const handleAddressesChange = useCallback(async () => {
    try {
      const response = await axiosInstance.get('/user-service/user/getAddress');
      if (response.data.success) {
        setAddresses(response.data.data);
      }
    } catch (error) {
      console.error('주소 목록 가져오기 실패:', error);
    }
  }, []);

  // 이벤트 핸들러들
  const handlePasswordChangeClick = useCallback(() => {
    dispatch(
      openModal({
        type: 'PASSWORD_CHANGE',
        props: {
          onSubmit: handlePasswordChange,
          loading: loadingState.passwordChangeLoading,
        },
      })
    );
  }, [dispatch, handlePasswordChange, loadingState.passwordChangeLoading]);

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

  const handleEditEmailClick = useCallback(() => {
    updateEditState({
      isEditingEmail: true,
      editEmail: localUserInfo?.email || '',
    });
    updateErrorState({ emailError: '' });
  }, [localUserInfo?.email, updateEditState, updateErrorState]);

  const handleEditPhoneClick = useCallback(() => {
    updateEditState({
      isEditingPhone: true,
      editPhone: localUserInfo?.phone || '',
      showVerificationInput: false,
      verificationCode: '',
    });
    updateErrorState({ phoneError: '' });
    dispatch(clearSMSAuth());
  }, [localUserInfo?.phone, updateEditState, updateErrorState, dispatch]);

  const handleChangePhoto = useCallback(() => {
    dispatch(
      openModal({
        type: 'PROFILE_PHOTO_CHANGE',
        props: {
          currentPhoto: localUserInfo?.profileImage,
          onSubmit: handlePhotoChange,
        },
      })
    );
  }, [dispatch, localUserInfo?.profileImage, handlePhotoChange]);

  // useEffect들
  useEffect(() => {
    if (userInfo) {
      setLocalUserInfo(userInfo);
      setAddresses(Array.isArray(userInfo.addresses) ? userInfo.addresses : []);
    }
  }, [userInfo]);

  useEffect(() => {
    if (isVerified && editState.editPhone) {
      handlePhoneChange();
    }
  }, [isVerified, editState.editPhone, handlePhoneChange]);

  // 초기 비밀번호 확인 모달 표시
  useEffect(() => {
    if (!userInfoLoading && !userInfoError && !localUserInfo) {
      dispatch(
        openModal({
          type: 'PASSWORD_CONFIRM',
          props: {
            onSubmit: handlePasswordConfirm,
            loading: userInfoLoading,
          },
        })
      );
    }
  }, [userInfoLoading, userInfoError, localUserInfo, dispatch, handlePasswordConfirm]);

  // 로딩 및 에러 상태 렌더링
  if (userInfoLoading) {
    return <LoadingSpinner />;
  }

  if (userInfoError) {
    return (
      <ErrorDisplay
        error={userInfoError}
        onRetry={() =>
          dispatch(
            openModal({
              type: 'PASSWORD_CONFIRM',
              props: {
                onSubmit: handlePasswordConfirm,
                loading: userInfoLoading,
              },
            })
          )
        }
      />
    );
  }

  if (!localUserInfo) {
    return <ErrorDisplay error="사용자 정보를 찾을 수 없습니다." showIcon={false} />;
  }

  // 메인 컴포넌트 렌더링
  return (
    <>
      <div className={styles.userProfilePage}>
        <div className={styles.container}>
          <div className={styles.profileCard}>
            <div className={styles.cardHeader}>
              <h1>회원정보 조회</h1>
              <button type="button" onClick={handlePasswordChangeClick}>
                비밀번호 변경
              </button>
            </div>

            <div className={styles.cardBody}>
              <div className={styles.personalInfoSection}>
                <h2 className={styles.sectionTitle}>개인 정보</h2>
                <div className={styles.infoLayout}>
                  <ProfileImage
                    profileImage={localUserInfo.profileImage}
                    onChangePhoto={handleChangePhoto}
                  />

                  <div className={styles.profileForm}>
                    <div className={styles.formGrid}>
                      <EditableField label="닉네임" value={localUserInfo.nickname} disabled />

                      <EditableField
                        label="아이디"
                        value={localUserInfo.loginId || localUserInfo.id}
                        disabled
                      />

                      <EditableField
                        label="전화번호"
                        value={localUserInfo.phone}
                        isEditing={editState.isEditingPhone}
                        onEdit={handleEditPhoneClick}
                        onCancel={() =>
                          updateEditState({
                            isEditingPhone: false,
                            showVerificationInput: false,
                            verificationCode: '',
                          })
                        }
                        error={errorState.phoneError || smsError}
                        hideActions
                      >
                        <PhoneVerification
                          editPhone={editState.editPhone}
                          onPhoneChange={e => updateEditState({ editPhone: e.target.value })}
                          showVerificationInput={editState.showVerificationInput}
                          verificationCode={editState.verificationCode}
                          onVerificationCodeChange={e =>
                            updateEditState({ verificationCode: e.target.value })
                          }
                          onSendVerificationCode={handleSendVerificationCode}
                          onVerifyCode={handleVerifyCode}
                          smsLoading={smsLoading}
                          phoneLoading={loadingState.phoneLoading}
                        />
                      </EditableField>

                      <DuplicateCheckInput
                        label="이메일"
                        value={editState.editEmail}
                        onChange={e => updateEditState({ editEmail: e.target.value })}
                        onCheck={handleEmailChange}
                        loading={loadingState.emailLoading}
                        success={
                          errorState.emailError === '' && editState.editEmail
                            ? '사용 가능한 이메일입니다.'
                            : ''
                        }
                        error={errorState.emailError}
                        placeholder="이메일을 입력하세요"
                        buttonLabel="중복확인"
                        inputId="email"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <AddrList
              addresses={addresses}
              onAddressUpdate={handleAddressUpdate}
              onAddressDelete={handleAddressDelete}
              onAddressesChange={handleAddressesChange}
            />

            <div className={styles.actionButtons}>
              <button type="button" className={styles.updateBtn} onClick={handleWithdrawalClick}>
                회원 탈퇴
              </button>
            </div>
          </div>
        </div>
      </div>
      <ModalController />
    </>
  );
}

export default UserInfoPage;
