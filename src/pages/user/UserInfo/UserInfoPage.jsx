import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// import { Eye, EyeOff, User, Mail, Phone, X, MapPin, Package, Camera } from 'lucide-react';
import { lookupUser, clearUserInfo } from '@/store/authSlice';
import styles from './UserInfoPage.module.scss'; // CSS Modules 사용

function UserInfoPage() {
  const dispatch = useDispatch();
  const { userInfo, userInfoLoading, userInfoError } = useSelector(state => state.auth);

  // 모달 상태
  const [showPasswordModal, setShowPasswordModal] = useState(true);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  // UserInfoPage.js 상단에 추가
  useEffect(() => {
    const token = localStorage.getItem('ACCESS_TOKEN');
    if (!token || token === 'test-token') {
      alert('로그인이 필요합니다.');
      // 로그인 페이지로 리다이렉트
      // window.location.href = '/login';
      return;
    }

    // 컴포넌트 마운트 시 기존 사용자 정보 초기화
    dispatch(clearUserInfo());
  }, [dispatch]);

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
    // 모달을 닫으면 이전 페이지로 돌아가거나 다른 처리
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
  if (!userInfo) {
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
          </div>

          {/* 상단 섹션 */}
          <div className={styles.cardBody}>
            <div className={styles.profileSection}>
              {/* 프로필 사진 섹션 */}
              <div className={styles.profileImageSection}>
                <div className={styles.profileImage}>
                  {userInfo.profileImage ? (
                    <img src={userInfo.profileImage} alt="프로필 사진" />
                  ) : (
                    <Camera size={48} className={styles.cameraIcon} />
                  )}
                </div>
                <p className={styles.profileLabel}>프로필 사진</p>
              </div>

              {/* 메인 정보 섹션 */}
              <div className={styles.profileForm}>
                <div className={styles.formGrid}>
                  <div className={styles.formField}>
                    <label>닉네임</label>
                    <div className={styles.fieldValue}>{userInfo.nickname || '정보 없음'}</div>
                  </div>

                  <div className={styles.formField}>
                    <label>아이디</label>
                    <div className={styles.fieldValue}>
                      {userInfo.loginId || userInfo.id || '정보 없음'}
                    </div>
                  </div>

                  <div className={styles.formField}>
                    <label>전화번호</label>
                    <div className={styles.fieldValue}>{userInfo.phone || '정보 없음'}</div>
                  </div>

                  <div className={styles.formField}>
                    <label>이메일</label>
                    <div className={styles.fieldValue}>{userInfo.email || '정보 없음'}</div>
                  </div>

                  <div className={styles.formField}>
                    <label>가입일</label>
                    <div className={styles.fieldValue}>
                      {userInfo.createdAt
                        ? new Date(userInfo.createdAt).toLocaleDateString('ko-KR')
                        : '정보 없음'}
                    </div>
                  </div>

                  <div className={styles.formField}>
                    <label>회원 등급</label>
                    <div className={styles.fieldValue}>{userInfo.role || '일반 회원'}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 하단 섹션 */}
          <div className={styles.cardFooter}>
            <div className={styles.infoSection}>
              {/* 주소 섹션 */}
              <div className={styles.infoBlock}>
                <div className={styles.infoHeader}>
                  <MapPin size={20} className={styles.infoIcon} />
                  <h3>주소</h3>
                </div>
                <div className={styles.infoContent}>
                  <p>{userInfo.address || '등록된 주소가 없습니다.'}</p>
                  {userInfo.detailAddress && <p>{userInfo.detailAddress}</p>}
                </div>
              </div>

              {/* 배송정보 섹션 */}
              <div className={styles.infoBlock}>
                <div className={styles.infoHeader}>
                  <Package size={20} className={styles.infoIcon} />
                  <h3>배송정보</h3>
                </div>
                <div className={styles.deliveryAddresses}>
                  {userInfo.deliveryAddresses && userInfo.deliveryAddresses.length > 0 ? (
                    userInfo.deliveryAddresses.map((address, index) => (
                      <div key={index} className={styles.deliveryItem}>
                        <p className={styles.deliveryTitle}>
                          {address.isDefault ? '기본 배송지' : `배송지 ${index + 1}`}
                        </p>
                        <p className={styles.deliveryAddress}>{address.address}</p>
                        {address.detailAddress && (
                          <p className={styles.deliveryAddress}>{address.detailAddress}</p>
                        )}
                        <p className={styles.deliveryContact}>
                          {address.phone} ({address.recipientName})
                        </p>
                      </div>
                    ))
                  ) : (
                    <div className={styles.infoContent}>
                      <p>등록된 배송지가 없습니다.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserInfoPage;
