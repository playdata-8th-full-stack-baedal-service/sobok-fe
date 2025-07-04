import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { signUpUser, clearSignUpSuccess } from '@/store/authSlice';
import { clearSMSAuth } from '@/store/smsAuthSlice'; // SMS 인증 상태 초기화 액션 추가
import ProfileSection from './components/signup/ProfileSection';
import PasswordSection from './components/signup/PasswordSection';
import PhoneVerification from './components/signup/PhoneVerification';
import EmailSection from './components/signup/EmailSection';
import AddressSection from './components/signup/AddressSection';
import Button from './components/common/Button';
import './UserSignUp.scss';
import {
  clearEmailCheck,
  clearLoginIdCheck,
  clearNicknameCheck,
} from '../../../../store/authSlice';

function UserSignUp() {
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

  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [emailLocal, setEmailLocal] = useState('');
  const [emailDomain, setEmailDomain] = useState('gmail.com');
  const [customDomain, setCustomDomain] = useState('');
  const [isCustomDomain, setIsCustomDomain] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');

  const handleInputChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
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
    });
    setPasswordConfirm('');
    setEmailLocal('');
    setEmailDomain('gmail.com');
    setCustomDomain('');
    setIsCustomDomain(false);
    setVerificationCode('');

    // SMS 인증 상태 초기화 추가
    dispatch(clearSMSAuth());
  };

  const validateForm = () => {
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

  const handleSubmit = async e => {
    e.preventDefault();

    if (!validateForm()) return;

    const completeFormData = {
      ...formData,
      email: getFullEmail() || null,
      roadFull: formData.roadFull.trim() === '' ? null : formData.roadFull,
      addrDetail: formData.addrDetail.trim() === '' ? null : formData.addrDetail,
    };

    try {
      await dispatch(signUpUser(completeFormData)).unwrap();
      alert('회원가입 요청 완료');
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
    }
  }, [signUpSuccess, dispatch]);

  return (
    <div className="signup-container">
      <div className="signup-header">
        <h2>회원가입</h2>
      </div>
      <form onSubmit={handleSubmit} className="signup-form">
        <ProfileSection formData={formData} onChange={handleInputChange} />

        <PasswordSection
          password={formData.password}
          passwordConfirm={passwordConfirm}
          onPasswordChange={handleInputChange}
          onPasswordConfirmChange={e => setPasswordConfirm(e.target.value)}
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
        />

        <AddressSection
          roadFull={formData.roadFull}
          addrDetail={formData.addrDetail}
          onAddressChange={handleAddressChange}
        />

        <div className="form-group">
          <Button type="submit" loading={loading}>
            회원가입
          </Button>
        </div>

        {error && <div className="error-message">{error}</div>}
      </form>
    </div>
  );
}

export default UserSignUp;
