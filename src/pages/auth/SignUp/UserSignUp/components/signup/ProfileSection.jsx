import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  checkNickName,
  clearNicknameCheck,
  checkLoginId,
  clearLoginIdCheck,
} from '@/store/authSlice';
import FormInput from '../common/FormInput';
import Button from '../common/Button';

function ProfileSection({ formData, onChange, onFileSelect }) {
  const dispatch = useDispatch();
  const {
    loading,
    nicknameCheckMessage,
    nicknameCheckError,
    loginIdCheckMessage,
    loginIdCheckError,
  } = useSelector(state => state.auth);

  const [imagePreview, setImagePreview] = useState(formData.photo || '/photodefault.svg');

  // 사진 변경 시 미리보기 반영
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
    if (!file) {
      console.log('[handleFileSelect] 파일 선택 안됨');
      return;
    }

    console.log('[handleFileSelect] 선택된 파일:', {
      name: file.name,
      type: file.type,
      size: file.size
    });

    if (!file.type.startsWith('image/')) {
      console.log('[handleFileSelect] 이미지 파일 아님:', file.type);
      alert('이미지 파일만 업로드 가능합니다.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      console.log('[handleFileSelect] 파일 크기 초과:', file.size);
      alert('파일 크기는 5MB 이하여야 합니다.');
      return;
    }

    // 파일 미리보기 생성
    const reader = new FileReader();
    reader.onload = e => {
      console.log('[handleFileSelect] 파일 미리보기 생성 완료');
      setImagePreview(e.target.result);
    };
    reader.readAsDataURL(file);

    // 파일을 상위 컴포넌트로 전달
    onFileSelect(file);
    e.target.value = '';
  };

  return (
    <div className="container-top">
      <div className="profile-image-section">
        <div className="profile-image-preview">
          <img
            src={imagePreview}
            alt="프로필 미리보기"
            style={{
              width: '120px',
              height: '120px',
              borderRadius: '50%',
              objectFit: 'cover',
              border: '2px solid #ddd',
            }}
          />
        </div>
        <div className="profile-image-upload">
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
              variant="secondary"
              onClick={() => {
                console.log('[ProfileSection] 프로필 이미지 선택 버튼 클릭');
                document.getElementById('profile-image-input').click();
              }}
            >
              프로필 이미지 선택
            </Button>
          </label>
        </div>
      </div>

      <div className="id-and-nick">
        <FormInput
          label="아이디"
          required
          className="input-with-button"
          success={loginIdCheckMessage}
          error={loginIdCheckError}
        >
          <div className="input-button-group">
            <input
              type="text"
              id="loginId"
              name="loginId"
              value={formData.loginId}
              onChange={handleLoginIdChange}
              className={loginIdCheckError ? 'input-error' : ''}
            />
            <Button
              type="button"
              variant="secondary"
              onClick={handleLoginIdCheck}
              loading={loading}
              disabled={!formData.loginId.trim()}
            >
              중복확인
            </Button>
          </div>
        </FormInput>

        <FormInput
          label="닉네임"
          required
          className="input-with-button"
          success={nicknameCheckMessage}
          error={nicknameCheckError}
        >
          <div className="input-button-group">
            <input
              type="text"
              id="nickname"
              name="nickname"
              value={formData.nickname}
              onChange={handleNicknameChange}
              className={nicknameCheckError ? 'input-error' : ''}
            />
            <Button
              type="button"
              variant="secondary"
              onClick={handleNicknameCheck}
              loading={loading}
              disabled={!formData.nickname.trim()}
            >
              중복확인
            </Button>
          </div>
        </FormInput>
      </div>
    </div>
  );
}

export default ProfileSection;