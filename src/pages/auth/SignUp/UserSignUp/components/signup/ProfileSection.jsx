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

  // 디바운스용 타이머 ref
  const loginIdTimer = useRef(null);
  const nicknameTimer = useRef(null);

  useEffect(() => {
    setImagePreview(formData.photo || '/photodefault.svg');
  }, [formData.photo]);

  const handleLoginIdChange = e => {
    dispatch(clearLoginIdCheck());
    onChange(e);

    if (loginIdTimer.current) clearTimeout(loginIdTimer.current);

    loginIdTimer.current = setTimeout(() => {
      if (e.target.value.trim()) {
        dispatch(checkLoginId(e.target.value.trim()));
      }
    }, 800);
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
              className="small"
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
            placeholder="아이디를 입력해주세요."
            value={formData.loginId}
            onChange={handleLoginIdChange}
            className={styles.inputWithButton}
            success={loginIdCheckMessage}
            error={loginIdCheckError}
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
