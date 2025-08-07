import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  checkNickName,
  clearNicknameCheck,
  checkLoginId,
  clearLoginIdCheck,
} from '@/store/authSlice';
import Input from '../../../../../../common/components/Input';
import Button from '../../../../../../common/components/Button';
import styles from './ProfileSection.module.scss';
import useToast from '@/common/hooks/useToast';

function ProfileSection({ formData, onChange, onFileSelect, showLoginIdInput = true }) {
  const dispatch = useDispatch();
  const { showNegative } = useToast();

  const {
    loading,
    nicknameCheckMessage,
    nicknameCheckError,
    loginIdCheckMessage,
    loginIdCheckError,
  } = useSelector(state => state.auth);

  const [imagePreview, setImagePreview] = useState(formData.photo || '/photodefault.svg');
  const [loginIdError, setLoginIdError] = useState('');

  // 디바운스용 타이머 ref
  const loginIdTimer = useRef(null);
  const nicknameTimer = useRef(null);

  useEffect(() => {
    setImagePreview(formData.photo || '/photodefault.svg');
  }, [formData.photo]);

  // 아이디 유효성 검사 함수
  const validateLoginId = (value) => {
    // 영어와 숫자만 허용하는 정규식
    const loginIdRegex = /^[a-zA-Z0-9]+$/;
    
    if (!value) {
      return '';
    }
    
    if (value.length < 4) {
      return '아이디는 4자 이상이어야 합니다.';
    }
    
    if (value.length > 20) {
      return '아이디는 20자 이하여야 합니다.';
    }
    
    if (!loginIdRegex.test(value)) {
      return '아이디는 영문자와 숫자만 사용 가능합니다.';
    }
    
    // 숫자로만 구성된 아이디 방지
    if (/^\d+$/.test(value)) {
      return '아이디는 숫자로만 구성될 수 없습니다.';
    }
    
    return '';
  };

  const handleLoginIdChange = e => {
    const { value } = e.target;
    
    // 영어와 숫자만 입력되도록 필터링
    const filteredValue = value.replace(/[^a-zA-Z0-9]/g, '');
    
    dispatch(clearLoginIdCheck());
    setLoginIdError('');
    
    // 원본 이벤트로 onChange 호출하되, 필터링된 값을 별도로 설정
    onChange({
      target: {
        name: 'loginId',
        value: filteredValue
      }
    });

    // 실시간 유효성 검사
    const validationError = validateLoginId(filteredValue);
    setLoginIdError(validationError);

    if (loginIdTimer.current) clearTimeout(loginIdTimer.current);

    // 유효성 검사를 통과한 경우에만 중복 체크 수행
    if (filteredValue.trim() && !validationError) {
      loginIdTimer.current = setTimeout(() => {
        dispatch(checkLoginId(filteredValue.trim()));
      }, 800);
    }
  };

  const handleNicknameChange = e => {
    dispatch(clearNicknameCheck());
    onChange(e);

    if (nicknameTimer.current) clearTimeout(nicknameTimer.current);

    nicknameTimer.current = setTimeout(() => {
      if (e.target.value.trim()) {
        dispatch(checkNickName(e.target.value.trim()));
      }
    }, 800);
  };

  const handleFileSelect = e => {
    const file = e.target.files[0];
    if (!file) {
      console.log('[handleFileSelect] 파일 선택 안됨');
      return;
    }

    console.log('[handleFileSelect] 선택된 파일:', {
      name: file.name,
      type: file.type,
      size: file.size,
    });

    if (!file.type.startsWith('image/')) {
      showNegative('이미지 파일만 업로드 가능합니다.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showNegative('파일 크기는 5MB 이하여야 합니다.');
      return;
    }

    const reader = new FileReader();
    reader.onload = e => {
      setImagePreview(e.target.result);
    };
    reader.readAsDataURL(file);
    onFileSelect(file);
    e.target.value = '';
  };

  // 아이디 에러 메시지 우선순위: 로컬 유효성 검사 > 서버 응답
  const displayLoginIdError = loginIdError || loginIdCheckError;

  return (
    <div className={styles.containerTop}>
      <div className={styles.profileImageSection}>
        <div className={styles.profileImagePreview}>
          <img src={imagePreview} alt="프로필 미리보기" className={styles.profileImage} />
        </div>
        <div className={styles.profileImageUpload}>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            style={{ display: 'none' }}
            id="profile-image-input"
          />
          <label htmlFor="profile-image-input">
            <Button
              type="button"
              variant="BASIC"
              className={styles.profileButton}
              onClick={() => {
                document.getElementById('profile-image-input').click();
              }}
            >
              이미지 선택
            </Button>
          </label>
        </div>
      </div>

      <div className={styles.idAndNick}>
        {showLoginIdInput && (
          <Input
            label="아이디"
            required
            type="text"
            id="loginId"
            name="loginId"
            placeholder="영문자, 숫자 4-20자리"
            value={formData.loginId}
            onChange={handleLoginIdChange}
            className={styles.inputWithButton}
            success={!displayLoginIdError && loginIdCheckMessage ? loginIdCheckMessage : ''}
            error={displayLoginIdError}
            maxLength={20}
          />
        )}

        <Input
          label="닉네임"
          required
          type="text"
          id="nickname"
          name="nickname"
          placeholder="닉네임을 입력해주세요."
          value={formData.nickname}
          onChange={handleNicknameChange}
          className={styles.inputWithButton}
          success={nicknameCheckMessage}
          error={nicknameCheckError}
        />
      </div>
    </div>
  );
}

export default ProfileSection;