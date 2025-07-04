import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios'; // axiosInstance 대신 axios 사용
import { API_BASE_URL } from '@/services/host-config'; 
import {
  checkNickName,
  clearNicknameCheck,
  checkLoginId,
  clearLoginIdCheck,
} from '@/store/authSlice';
import FormInput from '../common/FormInput';
import Button from '../common/Button';

function ProfileSection({ formData, onChange }) {
  const dispatch = useDispatch();
  const {
    loading,
    nicknameCheckMessage,
    nicknameCheckError,
    loginIdCheckMessage,
    loginIdCheckError,
  } = useSelector(state => state.auth);

  const [imageUploading, setImageUploading] = useState(false);
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

  const getPresignedUrl = async fileName => {
    try {
      console.log('요청 파라미터:', { fileName, category: 'profile' });
      
      // 회원가입 과정에서는 토큰이 없으므로 axios 사용
      const response = await axios.get(`${API_BASE_URL}api-service/api/presign`, {
        params: {
          fileName,
          category: 'profile',
        },
      });

      console.log('응답 데이터:', response.data);

      if (response.data.success && response.data.status === 200) {
        return response.data.data;
      }
      throw new Error(response.data.message || 'Presigned URL 생성 실패');
    } catch (error) {
      console.error('Presigned URL 실패:', error);
      console.error('에러 응답:', error.response?.data); 
      throw error;
    }
  };

  const uploadToS3 = async (presignedUrl, file) => {
    try {
      const response = await fetch(presignedUrl, {
        method: 'PUT',
        body: file,
        headers: { 'Content-Type': file.type },
      });

      if (!response.ok) throw new Error('S3 업로드 실패');
      return presignedUrl.split('?')[0];
    } catch (error) {
      console.error('S3 업로드 실패:', error);
      throw error;
    }
  };

  const handleFileSelect = async e => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('이미지 파일만 업로드 가능합니다.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('파일 크기는 5MB 이하여야 합니다.');
      return;
    }

    setImageUploading(true);

    try {
      const reader = new FileReader();
      reader.onload = e => setImagePreview(e.target.result);
      reader.readAsDataURL(file);

      const presignedUrl = await getPresignedUrl(file.name);
      const uploadedUrl = await uploadToS3(presignedUrl, file);

      onChange({ target: { name: 'photo', value: uploadedUrl } });
      alert('프로필 이미지가 성공적으로 업로드되었습니다.');
    } catch (error) {
      alert('이미지 업로드에 실패했습니다. 다시 시도해주세요.');
      setImagePreview(formData.photo || '/photodefault.svg');
    } finally {
      setImageUploading(false);
      e.target.value = '';
    }
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
            disabled={imageUploading}
            style={{ display: 'none' }}
            id="profile-image-input"
          />
          <label htmlFor="profile-image-input">
            <Button
              type="button"
              variant="secondary"
              loading={imageUploading}
              disabled={imageUploading}
              onClick={() => document.getElementById('profile-image-input').click()}
            >
              {imageUploading ? '업로드 중...' : '프로필 이미지 선택'}
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