import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  signUpUser,
  clearSignUpSuccess,
  clearEmailCheck,
  clearLoginIdCheck,
  clearNicknameCheck,
} from '@/store/authSlice';
import { clearSMSAuth } from '@/store/smsAuthSlice';
import ProfileSection from './components/signup/ProfileSection';
import PasswordSection from '../../../../common/forms/PasswordSection';
import PhoneVerification from '../../../../common/forms/PhoneVerification';
import EmailSection from '../../../../common/forms/EmailSection';
import AddressSection from '../../../../common/forms/AddressSection';
import Button from '../../../../common/components/Button';
import axios from 'axios';
import { API_BASE_URL } from '@/services/host-config';
import styles from './UserSignUp.module.scss';

function UserSignUp() {
  const dispatch = useDispatch();
  const ref = useRef(); // 유효성 검사 실패 시 포커스를 줄 때 사용

  // Redux 상태 (회원가입 진행 상황, 에러, 성공 여부, SMS 인증 여부)
  const { loading, error, signUpSuccess } = useSelector(state => state.auth);
  const { isVerified } = useSelector(state => state.smsAuth);

  // 기본 회원가입 입력 필드
  const [formData, setFormData] = useState({
    loginId: '',
    password: '',
    nickname: '',
    phone: '',
    photo: '/photodefault.svg',
    roadFull: '',
    addrDetail: '',
  });

  // 부가 입력 필드 (하나의 객체로 묶음)
  const [extraFields, setExtraFields] = useState({
    selectedFile: null, // 프로필 이미지 파일
    passwordConfirm: '', // 비밀번호 확인
    emailLocal: '', // 이메일 아이디
    customDomain: '', // 사용자 직접입력 도메인
    isCustomDomain: false, // 직접입력 도메인 선택 여부
    emailDomain: 'gmail.com', // 선택 도메인
    verificationCode: '', // 휴대폰 인증번호
  });

  // 구조 분해로 상태 꺼내기
  const {
    selectedFile,
    passwordConfirm,
    emailLocal,
    customDomain,
    isCustomDomain,
    emailDomain,
    verificationCode,
  } = extraFields;

  // 일반 input 값 변경 핸들러
  const handleInputChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // 파일 선택 시 실행
  const handleFileSelect = file => {
    setExtraFields(prev => ({ ...prev, selectedFile: file }));
  };

  // 이메일 도메인 선택 변경
  const handleDomainChange = selected => {
    if (selected === '직접입력') {
      setExtraFields(prev => ({
        ...prev,
        isCustomDomain: true,
        emailDomain: '',
      }));
    } else {
      setExtraFields(prev => ({
        ...prev,
        isCustomDomain: false,
        emailDomain: selected,
        customDomain: '',
      }));
    }
  };

  // 주소 필드 변경
  const handleAddressChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // 이메일 주소 전체 반환
  const getFullEmail = () => {
    const domain = isCustomDomain ? customDomain : emailDomain;
    return emailLocal && domain ? `${emailLocal}@${domain}` : '';
  };

  // 폼 초기화 함수
  const resetForm = () => {
    setFormData({
      loginId: '',
      password: '',
      nickname: '',
      phone: '',
      photo: '/photodefault.svg',
      roadFull: '',
      addrDetail: '',
    });
    setExtraFields({
      selectedFile: null,
      passwordConfirm: '',
      emailLocal: '',
      customDomain: '',
      isCustomDomain: false,
      emailDomain: 'gmail.com',
      verificationCode: '',
    });
    dispatch(clearSMSAuth());
  };

  // 유효성 검사 함수
  const validateForm = () => {
    const { loginId, password, nickname, phone } = formData;

    if (!loginId || !password || !nickname || !phone) {
      alert('필수 항목을 모두 입력해주세요.');
      ref.current?.focus();
      return false;
    }

    if (password !== passwordConfirm) {
      alert('비밀번호가 일치하지 않습니다.');
      return false;
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,16}$/;
    if (!passwordRegex.test(password)) {
      alert('비밀번호는 대소문자, 숫자, 특수문자를 포함하여 8~16자로 입력해주세요.');
      return false;
    }

    const phoneRegex = /^\d{11}$/;
    if (!phoneRegex.test(phone)) {
      alert('전화번호는 하이픈 없이 11자리 숫자로 입력해주세요.');
      return false;
    }

    if (!isVerified) {
      alert('휴대폰 인증을 완료해주세요.');
      return false;
    }

    return true;
  };

  // 임시 토큰 발급 요청
  const getTempToken = async () => {
    try {
      const { data } = await axios.get(`${API_BASE_URL}auth-service/auth/temp-token`);
      if (data.success && data.status === 200) return data.data;
      throw new Error(data.message || '임시 토큰 발급 실패');
    } catch (error) {
      console.error('임시 토큰 발급 실패:', error);
      throw error;
    }
  };

  // presigned URL 발급 요청
  const getPresignedUrl = async (fileName, tempToken) => {
    try {
      const { data } = await axios.get(`${API_BASE_URL}api-service/api/presign`, {
        params: { fileName, category: 'profile' },
        headers: {
          Authorization: `Bearer ${tempToken}`,
          'Content-Type': 'application/json',
        },
      });
      if (data.success && data.data) return data.data;
      throw new Error(data.message || 'Presigned URL 생성 실패');
    } catch (error) {
      console.error('Presigned URL 요청 실패:', error);
      throw error;
    }
  };

  // S3에 이미지 업로드
  const uploadToS3 = async (presignedUrl, file) => {
    try {
      const response = await fetch(presignedUrl, {
        method: 'PUT',
        body: file,
        headers: { 'Content-Type': file.type },
      });

      if (!response.ok) {
        throw new Error(`S3 업로드 실패: ${response.status} ${response.statusText}`);
      }

      return presignedUrl.split('?')[0]; // ? 앞까지가 실제 업로드된 URL
    } catch (error) {
      console.error('[uploadToS3] S3 업로드 오류:', error);
      throw error;
    }
  };

  // 폼 제출 처리
  const handleSubmit = async e => {
    e.preventDefault();
    if (!validateForm()) return;

    let completeFormData = {
      ...formData,
      email: getFullEmail() || null,
      roadFull: formData.roadFull.trim() || null,
      addrDetail: formData.addrDetail.trim() || null,
    };

    try {
      if (selectedFile) {
        const tempToken = await getTempToken();
        const presignedUrl = await getPresignedUrl(selectedFile.name, tempToken);
        const uploadedUrl = await uploadToS3(presignedUrl, selectedFile);
        completeFormData.photo = uploadedUrl;
      }

      await dispatch(signUpUser(completeFormData)).unwrap();
      alert('회원가입 요청 완료');
    } catch (err) {
      console.error('회원가입 실패:', err);
      alert(err?.message || '회원가입에 실패했습니다.');
    }
  };

  // 회원가입 성공 시 상태 초기화
  useEffect(() => {
    if (signUpSuccess) {
      alert('회원가입이 성공적으로 완료되었습니다.');
      resetForm();
      dispatch(clearSignUpSuccess());
      dispatch(clearEmailCheck());
      dispatch(clearNicknameCheck());
      dispatch(clearLoginIdCheck());
    }
  }, [signUpSuccess, dispatch]);

  return (
    <div className={styles['signup-wrap']}>
      <div className={styles['signup-container']}>
        <div className={styles['signup-header']}>
          <h2>회원가입</h2>
        </div>
        <form onSubmit={handleSubmit} className={styles['signup-form']}>
          <ProfileSection
            formData={formData}
            onChange={handleInputChange}
            onFileSelect={handleFileSelect}
          />
          <PasswordSection
            password={formData.password}
            passwordConfirm={passwordConfirm}
            onPasswordChange={handleInputChange}
            onPasswordConfirmChange={e =>
              setExtraFields(prev => ({ ...prev, passwordConfirm: e.target.value }))
            }
          />
          <PhoneVerification
            phone={formData.phone}
            verificationCode={verificationCode}
            onPhoneChange={handleInputChange}
            onVerificationCodeChange={e =>
              setExtraFields(prev => ({ ...prev, verificationCode: e.target.value }))
            }
          />
          <EmailSection
            emailLocal={emailLocal}
            emailDomain={emailDomain}
            customDomain={customDomain}
            isCustomDomain={isCustomDomain}
            onEmailLocalChange={e =>
              setExtraFields(prev => ({ ...prev, emailLocal: e.target.value }))
            }
            onDomainChange={handleDomainChange}
            onCustomDomainChange={e =>
              setExtraFields(prev => ({ ...prev, customDomain: e.target.value }))
            }
            getFullEmail={getFullEmail}
          />
          <AddressSection
            roadFull={formData.roadFull}
            addrDetail={formData.addrDetail}
            onAddressChange={handleAddressChange}
          />
          <div className={styles['form-group']}>
            <Button type="submit" loading={loading} variant="BASIC" className="wide">
              회원가입
            </Button>
          </div>
          {error && <div className={styles['error-message']}>{error}</div>}
        </form>
      </div>
    </div>
  );
}

export default UserSignUp;
