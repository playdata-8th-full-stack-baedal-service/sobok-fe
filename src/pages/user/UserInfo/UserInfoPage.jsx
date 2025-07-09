import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Eye, EyeOff, User, X, Camera } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { lookupUser } from '@/store/authSlice';
import { sendSMSCode, verifySMSCode, clearSMSAuth } from '@/store/smsAuthSlice';
import axiosInstance from '@/services/axios-config';
import styles from './UserInfoPage.module.scss';
import AddrList from './Unit/AddrList';

function UserInfoPage() {
  const nav = useNavigate();
  const dispatch = useDispatch();
  const { userInfo, userInfoLoading, userInfoError } = useSelector(state => state.auth);
  const { loading: smsLoading, error: smsError, isVerified } = useSelector(state => state.smsAuth);

  // 모달 상태
  const [showPasswordModal, setShowPasswordModal] = useState(true);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  // 비밀번호 변경 모달 상태
  const [showPasswordChangeModal, setShowPasswordChangeModal] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordChangeError, setPasswordChangeError] = useState('');
  const [passwordChangeLoading, setPasswordChangeLoading] = useState(false);

  // 회원탈퇴 모달 상태
  const [showWithdrawalModal, setShowWithdrawalModal] = useState(false);
  const [withdrawalPassword, setWithdrawalPassword] = useState('');
  const [showWithdrawalPassword, setShowWithdrawalPassword] = useState(false);
  const [withdrawalPasswordError, setWithdrawalPasswordError] = useState('');
  const [withdrawalLoading, setWithdrawalLoading] = useState(false);

  // 이메일 편집 상태
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [editEmail, setEditEmail] = useState('');
  const [emailLoading, setEmailLoading] = useState(false);
  const [emailError, setEmailError] = useState('');

  // 전화번호 편집 상태
  const [isEditingPhone, setIsEditingPhone] = useState(false);
  const [editPhone, setEditPhone] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [phoneLoading, setPhoneLoading] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [showVerificationInput, setShowVerificationInput] = useState(false);

  // 사용자 정보 로컬 상태
  const [localUserInfo, setLocalUserInfo] = useState(null);

  // 주소 목록 상태 관리
  const [addresses, setAddresses] = useState([]);

  // userInfo가 업데이트되면 localUserInfo와 addresses도 업데이트
  useEffect(() => {
    if (userInfo) {
      setLocalUserInfo(userInfo);
      // 주소 목록 상태 업데이트
      setAddresses(Array.isArray(userInfo.addresses) ? userInfo.addresses : []);
    }
  }, [userInfo]);

  // SMS 인증 완료 시 처리
  useEffect(() => {
    if (isVerified && editPhone) {
      handlePhoneChange();
    }
  }, [isVerified, editPhone]);

  // 주소 업데이트 핸들러 함수들 추가
  const handleAddressUpdate = (addressId, updatedAddress) => {
    setAddresses(prevAddresses =>
      prevAddresses.map(addr => (addr.id === addressId ? { ...addr, ...updatedAddress } : addr))
    );
  };

  const handleAddressesChange = async () => {
    // 주소 목록 다시 가져오기
    try {
      console.log('주소 목록 새로고침 시작...');
      const response = await axiosInstance.get('/user-service/user/getAddress');
      console.log('주소 목록 응답:', response.data.data);

      if (response.data.success) {
        setAddresses(response.data.data);
        console.log('주소 목록 업데이트 완료:', response.data.data);
      } else {
        console.error('주소 목록 가져오기 실패:', response.data.data);
      }
    } catch (error) {
      console.error('주소 목록 가져오기 실패:', error);
    }
  };


  const handlePasswordSubmit = async e => {
    e.preventDefault();
    if (!password.trim()) {
      setPasswordError('비밀번호를 입력해주세요.');
      return;
    }

    setPasswordError('');
    try {
      await dispatch(lookupUser({ password })).unwrap();
      setShowPasswordModal(false);
    } catch (error) {
      setPasswordError(error || '비밀번호 확인에 실패했습니다.');
    }
  };

  const handleCloseModal = () => {
    setShowPasswordModal(false);
  };

  // 비밀번호 변경 모달 열기
  const handlePasswordChangeClick = () => {
    setShowPasswordChangeModal(true);
    setNewPassword('');
    setConfirmPassword('');
    setPasswordChangeError('');
    setShowNewPassword(false);
    setShowConfirmPassword(false);
  };

  // 비밀번호 변경 모달 닫기
  const handleClosePasswordChangeModal = () => {
    setShowPasswordChangeModal(false);
    setNewPassword('');
    setConfirmPassword('');
    setPasswordChangeError('');
    setShowNewPassword(false);
    setShowConfirmPassword(false);
  };

  // 비밀번호 유효성 검사
  const validatePassword = (password) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (password.length < minLength) {
      return '비밀번호는 최소 8자 이상이어야 합니다.';
    }
    if (!hasUpperCase) {
      return '비밀번호에 대문자가 포함되어야 합니다.';
    }
    if (!hasLowerCase) {
      return '비밀번호에 소문자가 포함되어야 합니다.';
    }
    if (!hasNumbers) {
      return '비밀번호에 숫자가 포함되어야 합니다.';
    }
    if (!hasSpecialChar) {
      return '비밀번호에 특수문자가 포함되어야 합니다.';
    }
    return '';
  };

  // 비밀번호 변경 처리
  const handlePasswordChangeSubmit = async (e) => {
    e.preventDefault();

    if (!newPassword.trim()) {
      setPasswordChangeError('새 비밀번호를 입력해주세요.');
      return;
    }

    if (!confirmPassword.trim()) {
      setPasswordChangeError('새 비밀번호 확인을 입력해주세요.');
      return;
    }

    // 비밀번호 유효성 검사
    const passwordValidationError = validatePassword(newPassword);
    if (passwordValidationError) {
      setPasswordChangeError(passwordValidationError);
      return;
    }

    // 새 비밀번호와 확인 비밀번호 일치 여부 확인
    if (newPassword !== confirmPassword) {
      setPasswordChangeError('새 비밀번호와 확인 비밀번호가 일치하지 않습니다.');
      return;
    }

    // 기존 비밀번호와 동일한지 확인 (여기서는 간단히 처리, 실제로는 서버에서 확인)
    if (newPassword === password) {
      setPasswordChangeError('기존 비밀번호와 동일한 비밀번호는 사용할 수 없습니다.');
      return;
    }

    // 변경 확인 팝업
    const confirmChange = window.confirm('비밀번호를 변경하시겠습니까?');
    if (!confirmChange) {
      return;
    }

    setPasswordChangeLoading(true);
    setPasswordChangeError('');

    try {
      const response = await axiosInstance.patch('/auth-service/auth/edit-password', {
        newPassword: newPassword,
      });

      if (response.data.success && response.data.status === 200) {
        alert('비밀번호가 성공적으로 변경되었습니다.');
        setShowPasswordChangeModal(false);
      } else {
        setPasswordChangeError(response.data.message || '비밀번호 변경에 실패했습니다.');
      }
    } catch (error) {
      if (error.response?.data?.message) {
        setPasswordChangeError(error.response.data.message);
      } else {
        setPasswordChangeError('비밀번호 변경 중 오류가 발생했습니다.');
      }
    } finally {
      setPasswordChangeLoading(false);
    }
  };

  // 회원탈퇴 버튼 클릭
  const handleWithdrawalClick = () => {
    setShowWithdrawalModal(true);
    setWithdrawalPassword('');
    setWithdrawalPasswordError('');
  };

  // 회원탈퇴 모달 닫기
  const handleCloseWithdrawalModal = () => {
    setShowWithdrawalModal(false);
    setWithdrawalPassword('');
    setWithdrawalPasswordError('');
  };

  // 회원탈퇴 처리
  const handleWithdrawalSubmit = async e => {
    e.preventDefault();

    if (!withdrawalPassword.trim()) {
      setWithdrawalPasswordError('비밀번호를 입력해주세요.');
      return;
    }

    // 탈퇴 확인 팝업
    const confirmWithdrawal = window.confirm(
      '정말로 탈퇴하시겠습니까?\n탈퇴 후에는 계정을 복구할 수 없습니다.'
    );

    if (!confirmWithdrawal) {
      return;
    }

    setWithdrawalLoading(true);
    setWithdrawalPasswordError('');

    try {
      const response = await axiosInstance.delete('/auth-service/auth/delete', {
        data: {
          password: withdrawalPassword,
        },
      });

      if (response.data.success && response.data.status === 200) {
        alert('회원탈퇴가 완료되었습니다.');
        // 로그아웃 처리 및 홈페이지로 이동
        // 필요에 따라 로그아웃 액션 디스패치
        nav('/');
      } else {
        setWithdrawalPasswordError(response.data.message || '회원탈퇴에 실패했습니다.');
      }
    } catch (error) {
      if (error.response?.data?.message) {
        setWithdrawalPasswordError(error.response.data.message);
      } else {
        setWithdrawalPasswordError('회원탈퇴 중 오류가 발생했습니다.');
      }
    } finally {
      setWithdrawalLoading(false);
    }
  };

  // 이메일 변경 시작
  const handleEditEmailClick = () => {
    setIsEditingEmail(true);
    setEditEmail(localUserInfo?.email || '');
    setEmailError('');
  };

  // 이메일 변경 취소
  const handleCancelEmailEdit = () => {
    setIsEditingEmail(false);
    setEditEmail('');
    setEmailError('');
  };

  // 이메일 변경 확인
  const handleConfirmEmailEdit = async () => {
    if (!editEmail.trim()) {
      setEmailError('이메일을 입력해주세요.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(editEmail)) {
      setEmailError('올바른 이메일 형식을 입력해주세요.');
      return;
    }

    setEmailLoading(true);
    setEmailError('');

    try {
      const response = await axiosInstance.post('/user-service/user/editEmail', {
        email: editEmail,
      });

      if (response.data.success && response.data.status === 200) {
        setLocalUserInfo(prev => ({
          ...prev,
          email: editEmail,
        }));
        alert('이메일이 성공적으로 변경되었습니다.');
        setIsEditingEmail(false);
      } else {
        setEmailError(response.data.message || '이메일 변경에 실패했습니다.');
      }
    } catch (error) {
      if (error.response?.data?.message) {
        setEmailError(error.response.data.message);
      } else {
        setEmailError('이메일 변경 중 오류가 발생했습니다.');
      }
    } finally {
      setEmailLoading(false);
    }
  };

  // 전화번호 변경 시작
  const handleEditPhoneClick = () => {
    setIsEditingPhone(true);
    setEditPhone(localUserInfo?.phone || '');
    setPhoneError('');
    setShowVerificationInput(false);
    setVerificationCode('');
    dispatch(clearSMSAuth());
  };

  // 전화번호 변경 취소
  const handleCancelPhoneEdit = () => {
    setIsEditingPhone(false);
    setEditPhone('');
    setPhoneError('');
    setShowVerificationInput(false);
    setVerificationCode('');
    dispatch(clearSMSAuth());
  };

  // 전화번호 유효성 검사
  const validatePhoneNumber = phone => {
    const phoneRegex = /^01[0-9]{9}$/;
    return phoneRegex.test(phone);
  };

  // 인증번호 발송
  const handleSendVerificationCode = async () => {
    if (!editPhone.trim()) {
      setPhoneError('전화번호를 입력해주세요.');
      return;
    }

    if (!validatePhoneNumber(editPhone)) {
      setPhoneError('올바른 전화번호 형식을 입력해주세요. (01012345678)');
      return;
    }

    setPhoneError('');

    try {
      await dispatch(sendSMSCode(editPhone)).unwrap();
      setShowVerificationInput(true);
      alert('인증번호가 발송되었습니다.');
    } catch (error) {
      setPhoneError(error || 'SMS 전송에 실패했습니다.');
    }
  };

  // 인증번호 확인
  const handleVerifyCode = async () => {
    if (!verificationCode.trim()) {
      setPhoneError('인증번호를 입력해주세요.');
      return;
    }

    setPhoneError('');

    try {
      await dispatch(
        verifySMSCode({
          phoneNumber: editPhone,
          inputCode: verificationCode,
        })
      ).unwrap();
    } catch (error) {
      setPhoneError(error || '인증에 실패했습니다.');
    }
  };

  // 전화번호 변경 API 호출
  const handlePhoneChange = async () => {
    setPhoneLoading(true);
    setPhoneError('');

    try {
      const response = await axiosInstance.patch('/user-service/user/editPhone', {
        phone: editPhone,
      });

      if (response.data.success && response.data.status === 200) {
        setLocalUserInfo(prev => ({
          ...prev,
          phone: editPhone,
        }));
        alert('전화번호가 성공적으로 변경되었습니다.');
        setIsEditingPhone(false);
        setShowVerificationInput(false);
        setVerificationCode('');
        dispatch(clearSMSAuth());
      } else {
        setPhoneError(response.data.message || '전화번호 변경에 실패했습니다.');
      }
    } catch (error) {
      if (error.response?.data?.message) {
        setPhoneError(error.response.data.message);
      } else {
        setPhoneError('전화번호 변경 중 오류가 발생했습니다.');
      }
    } finally {
      setPhoneLoading(false);
    }
  };

  // 비밀번호 확인 모달
  if (showPasswordModal) {
    return (
      <div className={styles.passwordModal}>
        <div className={styles.modalContent}>
          <div className={styles.modalHeader}>
            <h2>비밀번호 확인</h2>
            <button onClick={handleCloseModal} className={styles.closeBtn}>
              <X size={24} />
            </button>
          </div>

          <p className={styles.modalDescription}>
            회원정보를 확인하기 위해 비밀번호를 입력해주세요.
          </p>

          <form onSubmit={handlePasswordSubmit}>
            <div className={styles.formGroup}>
              <label>비밀번호</label>
              <div className={styles.inputWrapper}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="비밀번호를 입력하세요"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={styles.togglePassword}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {passwordError && <p className={styles.errorMessage}>{passwordError}</p>}
            </div>

            <button type="submit" disabled={userInfoLoading} className={styles.submitBtn}>
              {userInfoLoading ? '확인 중...' : '확인'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // 비밀번호 변경 모달
  if (showPasswordChangeModal) {
    return (
      <div className={styles.passwordModal}>
        <div className={styles.modalContent}>
          <div className={styles.modalHeader}>
            <h2>비밀번호 변경</h2>
            <button onClick={handleClosePasswordChangeModal} className={styles.closeBtn}>
              <X size={24} />
            </button>
          </div>

          <p className={styles.modalDescription}>
            새로운 비밀번호를 입력해주세요.
          </p>

          <form onSubmit={handlePasswordChangeSubmit}>
            <div className={styles.formGroup}>
              <label>새 비밀번호</label>
              <div className={styles.inputWrapper}>
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  placeholder="새 비밀번호를 입력하세요"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className={styles.togglePassword}
                >
                  {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className={styles.formGroup}>
              <label>새 비밀번호 확인</label>
              <div className={styles.inputWrapper}>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  placeholder="새 비밀번호를 다시 입력하세요"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className={styles.togglePassword}
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {passwordChangeError && <p className={styles.errorMessage}>{passwordChangeError}</p>}
            </div>

            <div className={styles.passwordRequirements}>
              <p>비밀번호 요구사항:</p>
              <ul>
                <li>최소 8자 이상</li>
                <li>대문자, 소문자, 숫자, 특수문자 포함</li>
                <li>기존 비밀번호와 다른 비밀번호</li>
              </ul>
            </div>

            <button type="submit" disabled={passwordChangeLoading} className={styles.submitBtn}>
              {passwordChangeLoading ? '변경 중...' : '변경'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // 회원탈퇴 모달
  if (showWithdrawalModal) {
    return (
      <div className={styles.passwordModal}>
        <div className={styles.modalContent}>
          <div className={styles.modalHeader}>
            <h2>회원탈퇴</h2>
            <button onClick={handleCloseWithdrawalModal} className={styles.closeBtn}>
              <X size={24} />
            </button>
          </div>

          <p className={styles.modalDescription}>회원탈퇴를 위해 비밀번호를 입력해주세요.</p>

          <form onSubmit={handleWithdrawalSubmit}>
            <div className={styles.formGroup}>
              <label>비밀번호</label>
              <div className={styles.inputWrapper}>
                <input
                  type={showWithdrawalPassword ? 'text' : 'password'}
                  value={withdrawalPassword}
                  onChange={e => setWithdrawalPassword(e.target.value)}
                  placeholder="비밀번호를 입력하세요"
                />
                <button
                  type="button"
                  onClick={() => setShowWithdrawalPassword(!showWithdrawalPassword)}
                  className={styles.togglePassword}
                >
                  {showWithdrawalPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {withdrawalPasswordError && (
                <p className={styles.errorMessage}>{withdrawalPasswordError}</p>
              )}
            </div>

            <button type="submit" disabled={withdrawalLoading} className={styles.submitBtn}>
              {withdrawalLoading ? '탈퇴 중...' : '탈퇴하기'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // 로딩 중
  if (userInfoLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingContent}>
          <div className={styles.spinner} />
          <p>회원정보를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  // 오류 발생
  if (userInfoError) {
    return (
      <div className={styles.errorContainer}>
        <div className={styles.errorContent}>
          <div className={styles.errorIcon}>
            <User size={48} />
          </div>
          <p className={styles.errorMessage}>{userInfoError}</p>
          <button onClick={() => setShowPasswordModal(true)} className={styles.retryBtn}>
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  // 사용자 정보가 없는 경우
  if (!localUserInfo) {
    return (
      <div className={styles.errorContainer}>
        <div className={styles.errorContent}>
          <User size={48} className={styles.errorIcon} />
          <p>사용자 정보를 찾을 수 없습니다.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.userProfilePage}>
      <div className={styles.container}>
        <div className={styles.profileCard}>
          {/* 헤더 */}
          <div className={styles.cardHeader}>
            <h1>회원정보 조회</h1>
            <button onClick={handlePasswordChangeClick}>비밀번호 변경</button>
          </div>

          {/* 개인 정보 섹션 */}
          <div className={styles.cardBody}>
            <div className={styles.personalInfoSection}>
              <h2 className={styles.sectionTitle}>개인 정보</h2>
              <div className={styles.infoLayout}>
                {/* 프로필 사진 섹션 */}
                <div className={styles.profileImageSection}>
                  <div className={styles.profileImage}>
                    {localUserInfo.profileImage ? (
                      <img src={localUserInfo.profileImage} alt="프로필 사진" />
                    ) : (
                      <Camera size={48} className={styles.cameraIcon} />
                    )}
                  </div>
                  <button className={styles.changePhotoBtn}>사진 변경</button>
                </div>

                {/* 메인 정보 섹션 */}
                <div className={styles.profileForm}>
                  <div className={styles.formGrid}>
                    <div className={styles.formField}>
                      <label>닉네임</label>
                      <div className={styles.fieldValue}>
                        {localUserInfo.nickname || '정보 없음'}
                      </div>
                    </div>

                    <div className={styles.formField}>
                      <label>아이디</label>
                      <div className={styles.fieldValue}>
                        {localUserInfo.loginId || localUserInfo.id || '정보 없음'}
                      </div>
                    </div>

                    <div className={styles.formField}>
                      <label>전화번호</label>
                      <div className={styles.fieldValue}>
                        {isEditingPhone ? (
                          <div className={styles.editingField}>
                            <input
                              type="text"
                              value={editPhone}
                              onChange={e => setEditPhone(e.target.value)}
                              placeholder="전화번호를 입력하세요 (01012345678)"
                              className={styles.editInput}
                              maxLength={11}
                            />
                            <div className={styles.editActions}>
                              {!showVerificationInput ? (
                                <>
                                  <button
                                    onClick={handleSendVerificationCode}
                                    disabled={smsLoading}
                                    className={styles.confirmBtn}
                                  >
                                    {smsLoading ? '발송 중...' : '인증하기'}
                                  </button>
                                  <button
                                    onClick={handleCancelPhoneEdit}
                                    className={styles.cancelBtn}
                                  >
                                    취소
                                  </button>
                                </>
                              ) : (
                                <div className={styles.verificationSection}>
                                  <input
                                    type="text"
                                    value={verificationCode}
                                    onChange={e => setVerificationCode(e.target.value)}
                                    placeholder="인증번호를 입력하세요"
                                    className={styles.verificationInput}
                                    maxLength={6}
                                  />
                                  <button
                                    onClick={handleVerifyCode}
                                    disabled={smsLoading || phoneLoading}
                                    className={styles.confirmBtn}
                                  >
                                    {smsLoading || phoneLoading ? '확인 중...' : '확인'}
                                  </button>
                                  <button
                                    onClick={handleCancelPhoneEdit}
                                    className={styles.cancelBtn}
                                  >
                                    취소
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        ) : (
                          <div className={styles.fieldWithButton}>
                            <span>{localUserInfo.phone || '정보 없음'}</span>
                            <button onClick={handleEditPhoneClick} className={styles.changeBtn}>
                              {localUserInfo.phone ? '변경' : '추가'}
                            </button>
                          </div>
                        )}
                        {phoneError && <p className={styles.errorMessage}>{phoneError}</p>}
                        {smsError && <p className={styles.errorMessage}>{smsError}</p>}
                      </div>
                    </div>

                    <div className={styles.formField}>
                      <label>이메일</label>
                      <div className={styles.fieldValue}>
                        {isEditingEmail ? (
                          <div className={styles.editingField}>
                            <input
                              type="email"
                              value={editEmail}
                              onChange={e => setEditEmail(e.target.value)}
                              placeholder="이메일을 입력하세요"
                              className={styles.editInput}
                            />
                            <div className={styles.editActions}>
                              <button
                                onClick={handleConfirmEmailEdit}
                                disabled={emailLoading}
                                className={styles.confirmBtn}
                              >
                                {emailLoading ? '확인 중...' : '확인'}
                              </button>
                              <button onClick={handleCancelEmailEdit} className={styles.cancelBtn}>
                                취소
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className={styles.fieldWithButton}>
                            <span>{localUserInfo.email || '정보 없음'}</span>
                            <button onClick={handleEditEmailClick} className={styles.changeBtn}>
                              {localUserInfo.email ? '변경' : '추가'}
                            </button>
                          </div>
                        )}
                        {emailError && <p className={styles.errorMessage}>{emailError}</p>}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 주소 섹션 - 수정된 부분 */}
          <AddrList
            addresses={addresses}
            onAddressUpdate={handleAddressUpdate}
            onAddressesChange={handleAddressesChange}
          />

          {/* 하단 버튼 */}
          <div className={styles.actionButtons}>
            <button className={styles.updateBtn} onClick={handleWithdrawalClick}>
              회원 탈퇴
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserInfoPage;