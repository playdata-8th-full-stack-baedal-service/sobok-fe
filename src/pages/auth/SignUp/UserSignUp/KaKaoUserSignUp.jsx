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
import PasswordSection from '../../../../common/forms/PasswordConfirm/PasswordSection';
import PhoneVerification from '../../../../common/forms/Phone/PhoneVerification';
import EmailSection from '../../../../common/forms/Email/EmailSection';
import AddressSection from '../../../../common/forms/Address/AddressSection';
import Button from '../../../../common/components/Button';
import axios from 'axios';
import { API_BASE_URL } from '@/services/host-config';
import styles from './UserSignUp.module.scss';

import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { kakaoSignUpUser } from '../../../../store/authSlice';

function UserSignUp() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const ref = useRef();

  const { loading, error, signUpSuccess } = useSelector(state => state.auth);
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
  const [isSocialUser, setIsSocialUser] = useState(false);

  const location = useLocation();
  const signupData = location.state;

  const [searchParams] = useSearchParams();

  // 쿼리에서 값 꺼내기
  const provider = searchParams.get('provider');
  const oauthId = searchParams.get('oauthId');
  const nickname = searchParams.get('nickname');
  const email = searchParams.get('email');

  useEffect(() => {
    console.log('쿼리로 전달받은 값:', {
      provider,
      oauthId,
      nickname,
      email,
    });
    if (signupData) {
      console.log('넘겨받은 JSON:', signupData);

      if (signupData.provider === 'KAKAO' || signupData.provider === 'GOOGLE') {
        // 1. 닉네임 자동 입력
        if (signupData.nickname) {
          setFormData(prev => ({
            ...prev,
            nickname: signupData.nickname,
          }));
        }

        // 2. 이메일 자동 입력 (local@domain 분리)
        if (signupData.email) {
          const [local, domain] = signupData.email.split('@');
          setEmailLocal(local || '');
          setEmailDomain(domain || 'gmail.com'); // 기본값
        }

        // 소셜 로그인일 때, 필수 입력값을 임의로 채움
        setFormData(prev => ({
          ...prev,
          loginId: `social_${signupData.kakaoId}`, // 임의 아이디
          password: 'Password123!!', // 임의 비밀번호
          nickname: signupData.nickname || '',
          phone: signupData.phone || '',
          oauthId: signupData.oauthId || null,
        }));
        setPasswordConfirm('Password123!!');
        setIsSocialUser(true);
      }
    } else {
      console.warn('state가 비어 있습니다. 새로고침 시 사라질 수 있습니다.');
    }
  }, [signupData]);

  const handleInputChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileSelect = file => {
    setSelectedFile(file);
  };

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
    console.log('isSocialUser의 값', isSocialUser);

    if (!formData.loginId || !formData.password || !formData.nickname || !formData.phone) {
      alert('필수 항목을 모두 입력해주세요.');
      ref.current?.focus();
      return false;
    }

    if (formData.password !== passwordConfirm) {
      alert('비밀번호가 일치하지 않습니다.');
      return false;
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,16}$/;
    if (!passwordRegex.test(formData.password)) {
      alert('비밀번호는 대소문자, 숫자, 특수문자를 포함하여 8~16자로 입력해주세요.');
      return false;
    }

    const phoneRegex = /^\d{11}$/;
    if (!phoneRegex.test(formData.phone)) {
      alert('전화번호는 하이픈 없이 11자리 숫자로 입력해주세요.');
      return false;
    }

    if (!isVerified) {
      alert('휴대폰 인증을 완료해주세요.');
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

    if (!validateForm()) return;

    let completeFormData = {
      ...formData,
      email: getFullEmail() || null,
      roadFull: formData.roadFull.trim() === '' ? null : formData.roadFull,
      addrDetail: formData.addrDetail.trim() === '' ? null : formData.addrDetail,
    };

    try {
      // 프로필 사진이 선택된 경우 S3에 업로드
      if (selectedFile) {
        const tempToken = await getTempToken();
        const uploadedUrl = await uploadToS3(selectedFile, tempToken);
        completeFormData = {
          ...completeFormData,
          photo: uploadedUrl,
        };
      }

      console.log('[회원가입 요청 데이터]', completeFormData);

      await dispatch(kakaoSignUpUser(completeFormData)).unwrap();
      Navigate;
    } catch (err) {
      console.error('회원가입 실패:', err);
      alert(err || '회원가입에 실패했습니다.');
    }
  };

  useEffect(() => {
    if (signUpSuccess) {
      alert('회원가입이 성공적으로 완료되었습니다.');
      resetForm();
      dispatch(clearSignUpSuccess());
      dispatch(clearEmailCheck());
      dispatch(clearNicknameCheck());
      dispatch(clearLoginIdCheck());
      navigate('/auth/signup/complete');
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
            disabled={true}
          />

          <AddressSection
            roadFull={formData.roadFull}
            addDetail={formData.addrDetail}
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
