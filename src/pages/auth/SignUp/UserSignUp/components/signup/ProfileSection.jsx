import React, { useEffect, useState } from 'react';
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

function ProfileSection({ formData, onChange, onFileSelect, disabled }) {
  const dispatch = useDispatch();
  const {
    loading,
    nicknameCheckMessage,
    nicknameCheckError,
    loginIdCheckMessage,
    loginIdCheckError,
  } = useSelector(state => state.auth);

  const [imagePreview, setImagePreview] = useState(formData.photo || '/photodefault.svg');

  useEffect(() => {
    setImagePreview(formData.photo || '/photodefault.svg');
  }, [formData.photo]);

  const handleLoginIdCheck = async () => {
    if (!formData.loginId.trim()) {
      alert('아이디를 입력해주세요.');
      return;
    }
    try {
      await dispatch(checkLoginId(formData.loginId)).unwrap();
    } catch (error) {
      console.error('아이디 중복 확인 실패:', error);
    }
  };

  const handleNicknameCheck = async () => {
    if (!formData.nickname.trim()) {
      alert('닉네임을 입력해주세요.');
      return;
    }
    try {
      await dispatch(checkNickName(formData.nickname)).unwrap();
    } catch (error) {
      console.error('닉네임 중복 확인 실패:', error);
    }
  };

  const handleLoginIdChange = e => {
    dispatch(clearLoginIdCheck());
    onChange(e);
  };

  const handleNicknameChange = e => {
    dispatch(clearNicknameCheck());
    onChange(e);
  };

  const handleFileSelect = e => {
    const file = e.target.files[0];
<<<<<<< HEAD
    if (!file) return;
=======
    if (!file) {
      console.log('[handleFileSelect] 파일 선택 안됨');
      return;
    }

    console.log('[handleFileSelect] 선택된 파일:', {
      name: file.name,
      type: file.type,
      size: file.size,
    });
>>>>>>> 9db18ce5431a10d75e15a630f7fd63d5d65fc6ae

    if (!file.type.startsWith('image/')) {
      alert('이미지 파일만 업로드 가능합니다.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('파일 크기는 5MB 이하여야 합니다.');
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
        <Input
          label="아이디"
          required
          className={styles.inputWithButton}
          success={loginIdCheckMessage}
          error={loginIdCheckError}
        >
          <div className={styles.inputButtonGroup}>
            <input
              type="text"
              id="loginId"
              name="loginId"
              value={formData.loginId}
              onChange={handleLoginIdChange}
<<<<<<< HEAD
              className={loginIdCheckError ? styles.inputError : ''}
=======
              className={loginIdCheckError ? 'input-error' : ''}
              disabled={disabled}
>>>>>>> 9db18ce5431a10d75e15a630f7fd63d5d65fc6ae
            />
            <Button type="button" variant="BASIC" onClick={handleLoginIdCheck} loading={loading}>
              중복확인
            </Button>
          </div>
        </Input>

        <Input
          label="닉네임"
          required
          className={styles.inputWithButton}
          success={nicknameCheckMessage}
          error={nicknameCheckError}
        >
          <div className={styles.inputButtonGroup}>
            <input
              type="text"
              id="nickname"
              name="nickname"
              value={formData.nickname}
              onChange={handleNicknameChange}
              className={nicknameCheckError ? styles.inputError : ''}
            />
            <Button type="button" variant="BASIC" onClick={handleNicknameCheck} loading={loading}>
              중복확인
            </Button>
          </div>
        </Input>
      </div>
    </div>
  );
}

export default ProfileSection;
