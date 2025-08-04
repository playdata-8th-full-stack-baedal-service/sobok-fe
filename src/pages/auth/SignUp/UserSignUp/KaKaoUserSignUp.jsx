import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  kakaoSignUpUser,
  clearSignUpSuccess,
  clearEmailCheck,
  clearLoginIdCheck,
  clearNicknameCheck,
  checkNickName,
} from '@/store/authSlice';
import { clearSMSAuth } from '@/store/smsAuthSlice';
import ProfileSection from './components/signup/ProfileSection';
import PhoneVerification from '../../../../common/forms/Phone/PhoneVerification';
import EmailSection from '../../../../common/forms/Email/EmailSection';
import AddressSection from '../../../../common/forms/Address/AddressSection';
import Button from '../../../../common/components/Button';
import axios from 'axios';
import { API_BASE_URL } from '@/services/host-config';
import styles from './UserSignUp.module.scss';
import useToast from '@/common/hooks/useToast';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';

function UserSignUp() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const ref = useRef();
  const { showNegative } = useToast();

  const { loading, error, signUpSuccess, isNicknameChecked } = useSelector(state => state.auth);
  const { isVerified } = useSelector(state => state.smsAuth);

  const [formData, setFormData] = useState({
    loginId: '',
    password: '',
    nickname: '',
    phone: '',
    photo: '/photodefault.svg',
    roadFull: '',
    addrDetail: '',
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [emailLocal, setEmailLocal] = useState('');
  const [emailDomain, setEmailDomain] = useState('gmail.com');
  const [customDomain, setCustomDomain] = useState('');
  const [isCustomDomain, setIsCustomDomain] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');

  const location = useLocation();
  const signupData = location.state;
  const [searchParams] = useSearchParams();

  const provider = searchParams.get('provider');
  const oauthId = searchParams.get('oauthId');
  const nickname = searchParams.get('nickname');
  const email = searchParams.get('email');

  // 소셜 로그인 값 자동 입력
  useEffect(() => {
    if (signupData && (signupData.provider === 'KAKAO' || signupData.provider === 'GOOGLE')) {
      if (signupData.nickname) {
        setFormData(prev => ({
          ...prev,
          nickname: signupData.nickname,
        }));
      }
      if (signupData.email) {
        const [local, domain] = signupData.email.split('@');
        setEmailLocal(local || '');
        setEmailDomain(domain || 'gmail.com');
      }
      setFormData(prev => ({
        ...prev,
        loginId: `social_${signupData.kakaoId || signupData.oauthId}`,
        password: 'Password123!!',
        nickname: signupData.nickname || '',
        phone: signupData.phone || '',
        oauthId: signupData.oauthId || null,
      }));
      setPasswordConfirm('Password123!!');
    }
  }, [signupData]);

  // 닉네임 자동 입력 시 중복 검사 자동 실행
  useEffect(() => {
    if (formData.nickname.trim()) {
      const timer = setTimeout(() => {
        dispatch(checkNickName(formData.nickname));
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [formData.nickname]);

  const handleInputChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileSelect = file => setSelectedFile(file);

  const handleDomainChange = selected => {
    if (selected === '직접입력') {
      setIsCustomDomain(true);
      setEmailDomain('');
    } else {
      setIsCustomDomain(false);
      setEmailDomain(selected);
      setCustomDomain('');
    }
  };

  const handleAddressChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const getFullEmail = () => {
    const domain = isCustomDomain ? customDomain : emailDomain;
    return emailLocal && domain ? `${emailLocal}@${domain}` : '';
  };

  const resetForm = () => {
    setFormData({
      loginId: '',
      password: '',
      nickname: '',
      phone: '',
      photo: '/photodefault.svg',
      roadFull: '',
      addrDetail: '',
      oauthId: null,
    });
    setSelectedFile(null);
    setPasswordConfirm('');
    setEmailLocal('');
    setEmailDomain('gmail.com');
    setCustomDomain('');
    setIsCustomDomain(false);
    setVerificationCode('');
    dispatch(clearSMSAuth());
  };

  const validateForm = () => {
    if (!formData.loginId || !formData.password || !formData.nickname || !formData.phone) {
      showNegative('필수 항목을 모두 입력해주세요.');
      ref.current?.focus();
      return false;
    }
    if (formData.password !== passwordConfirm) {
      showNegative('비밀번호가 일치하지 않습니다.');
      return false;
    }

    // 비밀번호 검증
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,16}$/;
    if (!passwordRegex.test(formData.password)) {
      showNegative('비밀번호는 대소문자, 숫자, 특수문자를 포함하여 8~16자로 입력해주세요.');
      return false;
    }

    // 전화번호 검증
    const phoneRegex = /^\d{11}$/;
    if (!phoneRegex.test(formData.phone)) {
      showNegative('전화번호는 하이픈 없이 11자리 숫자로 입력해주세요.');
      return false;
    }
    if (!isVerified) {
      showNegative('휴대폰 인증을 완료해주세요.');
      return false;
    }

    // 이메일 검증
    const emailValue = getFullEmail();
    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    if (emailValue && !emailRegex.test(emailValue)) {
      showNegative('올바른 이메일 형식이 아닙니다.');
      return false;
    }
    return true;
  };

  const getTempToken = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/auth-service/auth/temp-token`);
      if (response.data.success && response.data.status === 200) {
        return response.data.data;
      }
      throw new Error(response.data.message || '임시 토큰 발급 실패');
    } catch (error) {
      console.error('임시 토큰 발급 실패:', error);
      throw error;
    }
  };

  const uploadToS3 = async (file, tempToken) => {
    const formImageData = new FormData();
    formImageData.append('image', file);
    try {
      const response = await axios.put(
        `${API_BASE_URL}/api-service/api/upload-image/profile`,
        formImageData,
        {
          headers: {
            Authorization: `Bearer ${tempToken}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
      throw new Error(response.data.message || 'Presigned URL 생성 실패');
    } catch (error) {
      console.error('Presigned URL 요청 실패:', error);
      throw error;
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!isNicknameChecked) {
      showNegative('닉네임 중복확인을 해주세요.');
      return;
    }
    if (!validateForm()) return;

    let completeFormData = {
      ...formData,
      email: getFullEmail() || null,
      roadFull: formData.roadFull.trim() === '' ? null : formData.roadFull,
      addrDetail: formData.addrDetail.trim() === '' ? null : formData.addrDetail,
      inputCode: verificationCode,
    };

    try {
      if (selectedFile) {
        const tempToken = await getTempToken();
        const uploadedUrl = await uploadToS3(selectedFile, tempToken);
        completeFormData = { ...completeFormData, photo: uploadedUrl };
      }
      await dispatch(kakaoSignUpUser(completeFormData)).unwrap();
    } catch (err) {
      console.error('회원가입 실패:', err);
      showNegative(err || '회원가입에 실패했습니다.');
    }
  };

  useEffect(() => {
    if (signUpSuccess) {
      resetForm();
      dispatch(clearSignUpSuccess());
      dispatch(clearEmailCheck());
      dispatch(clearNicknameCheck());
      dispatch(clearLoginIdCheck());
      navigate('/auth/signup/complete');
    }
  }, [signUpSuccess, dispatch]);

  // 페이지 진입 시 SMS 인증 초기화
  useEffect(() => {
    dispatch(clearSMSAuth());
  }, []);

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
            disabled={true}
            showLoginIdInput={false}
          />
          <PhoneVerification
            phone={formData.phone}
            verificationCode={verificationCode}
            onPhoneChange={handleInputChange}
            onVerificationCodeChange={e => setVerificationCode(e.target.value)}
          />
          <EmailSection
            emailLocal={emailLocal}
            emailDomain={emailDomain}
            customDomain={customDomain}
            isCustomDomain={isCustomDomain}
            onEmailLocalChange={e => setEmailLocal(e.target.value)}
            onDomainChange={handleDomainChange}
            onCustomDomainChange={e => setCustomDomain(e.target.value)}
            getFullEmail={getFullEmail}
            disabled={false}
          />
          <AddressSection
            roadFull={formData.roadFull}
            addDetail={formData.addrDetail}
            onAddressChange={handleAddressChange}
            showDetail={true}
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
