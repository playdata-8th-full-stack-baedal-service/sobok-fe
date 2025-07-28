import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
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
import styles from './UserSignUp.module.scss';
import useToast from '@/common/hooks/useToast';

function UserSignUp() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { showSuccess, showNegative } = useToast();

  const { loading, error, signUpSuccess } = useSelector(state => state.auth);
  const { isVerified } = useSelector(state => state.smsAuth);

  const [formData, setFormData] = useState({
    loginId: '',
    password: '',
    nickname: '',
    phone: '',
    photo: '',
    roadFull: '',
    addrDetail: '',
  });

  const [passwordConfirm, setPasswordConfirm] = useState('');

  const [emailLocal, setEmailLocal] = useState('');
  const [customDomain, setCustomDomain] = useState('');
  const [isCustomDomain, setIsCustomDomain] = useState(false);
  const [emailDomain, setEmailDomain] = useState('gmail.com');

  const [verificationCode, setVerificationCode] = useState('');

  const handleInputChange = e => {
    const { name, value } = e.target;

    if (name === 'loginId' && value === '') {
      dispatch(clearLoginIdCheck());
    }
    if (name === 'nickname' && value === '') {
      dispatch(clearNicknameCheck());
    }

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
    dispatch(clearSMSAuth());
    dispatch(clearNicknameCheck());
    dispatch(clearLoginIdCheck());
    dispatch(clearEmailCheck());
  };

  const validateForm = () => {
    if (!formData.loginId || !formData.password || !formData.nickname || !formData.phone) {
      showNegative('필수 항목을 모두 입력해주세요.');
      return false;
    }

    if (formData.password !== passwordConfirm) {
      showNegative('비밀번호가 일치하지 않습니다.');
      return false;
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,16}$/;
    if (!passwordRegex.test(formData.password)) {
      showNegative('비밀번호는 대소문자, 숫자, 특수문자를 포함하여 8~16자로 입력해주세요.');
      return false;
    }

    const phoneRegex = /^\d{11}$/;
    if (!phoneRegex.test(formData.phone)) {
      showNegative('전화번호는 하이픈 없이 11자리 숫자로 입력해주세요.');
      return false;
    }

    if (!isVerified) {
      showNegative('휴대폰 인증을 완료해주세요.');
      return false;
    }

    return true;
  };

  const { isLoginIdChecked, isNicknameChecked, isEmailChecked } = useSelector(state => state.auth);

  const handleSubmit = async e => {
    e.preventDefault();

    if (!validateForm()) return;

    if (!isLoginIdChecked) {
      showNegative('아이디 중복체크를 완료해주세요.');
      return;
    }
    if (!isNicknameChecked) {
      showNegative('닉네임 중복체크를 완료해주세요.');
      return;
    }
    if (getFullEmail() && !isEmailChecked) {
      showNegative('이메일 중복체크를 완료해주세요.');
      return;
    }

    let completeFormData = {
      ...formData,
      email: getFullEmail() || null,
      roadFull: formData.roadFull.trim() === '' ? null : formData.roadFull,
      addrDetail: formData.addrDetail.trim() === '' ? null : formData.addrDetail,
      inputCode: verificationCode,
    };

    try {
      await dispatch(signUpUser(completeFormData)).unwrap();
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
