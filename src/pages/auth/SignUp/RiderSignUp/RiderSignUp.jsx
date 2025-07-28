import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  clearSignUpSuccess,
  riderSignUp,
  checkPermission,
  clearPermissionCheck,
} from '@/store/riderSlice';
import { sendSMSCode, verifySMSCode, clearSMSAuth } from '@/store/smsAuthSlice';
import { checkLoginId, clearLoginIdCheck } from '@/store/authSlice';
import styles from './RiderSignUp.module.scss';
import useToast from '@/common/hooks/useToast';
import PhoneVerification from '../../../../common/forms/Phone/PhoneVerification';
import PasswordSection from '../../../../common/forms/PasswordConfirm/PasswordSection';
import Input from '../../../../common/components/Input';
import { clearAllChecks } from '@/store/authSlice';
function RiderSignUp() {
  const dispatch = useDispatch();
  const { showSuccess } = useToast();

  const { loading, error, signUpSuccess, permissionCheckMessage, permissionCheckError } =
    useSelector(state => state.rider);
  const { isVerified } = useSelector(state => state.smsAuth);
  const { loginIdCheckMessage, loginIdCheckError } = useSelector(state => state.auth);

  const [form, setForm] = useState({
    loginId: '',
    password: '',
    passwordConfirm: '',
    name: '',
    phone: '',
    permissionNumber: '',
  });

  const [verificationCode, setVerificationCode] = useState('');
  const loginIdTimer = useRef(null);
  const permissionTimer = useRef(null);

  // 폼 클리어
  useEffect(() => {
    dispatch(clearAllChecks());
    dispatch(clearSMSAuth());
  }, [dispatch]);

  // 회원가입 성공 시 초기화
  useEffect(() => {
    if (signUpSuccess) {
      showSuccess('회원가입 신청이 완료되었습니다!');
      dispatch(clearSignUpSuccess());
      dispatch(clearSMSAuth());
      dispatch(clearLoginIdCheck());
      dispatch(clearPermissionCheck());
      setForm({
        loginId: '',
        password: '',
        passwordConfirm: '',
        name: '',
        phone: '',
        permissionNumber: '',
      });
      setVerificationCode('');
    }
  }, [signUpSuccess, dispatch, showSuccess]);

  // 아이디 자동 검사
  useEffect(() => {
    if (loginIdTimer.current) clearTimeout(loginIdTimer.current);
    if (!form.loginId.trim()) {
      dispatch(clearLoginIdCheck());
      return;
    }
    loginIdTimer.current = setTimeout(() => {
      dispatch(checkLoginId(form.loginId.trim()));
    }, 400);
  }, [form.loginId, dispatch]);

  // 면허번호 자동 검사
  useEffect(() => {
    if (permissionTimer.current) clearTimeout(permissionTimer.current);
    if (!form.permissionNumber.trim()) {
      dispatch(clearPermissionCheck());
      return;
    }

    if (!/^\d{12}$/.test(form.permissionNumber)) {
      dispatch(clearPermissionCheck());
      return;
    }

    permissionTimer.current = setTimeout(() => {
      dispatch(checkPermission(form.permissionNumber.trim()));
    }, 400);
  }, [form.permissionNumber, dispatch]);

  const handleChange = e => {
    const { name, value } = e.target;
    if (name === 'permissionNumber' && !/^\d*$/.test(value)) return;

    setForm(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    const { passwordConfirm, ...signUpData } = form;
    dispatch(riderSignUp(signUpData));
  };

  const getInputClassName = fieldName => {
    switch (fieldName) {
      case 'loginId':
        return loginIdCheckMessage?.includes('사용 가능한') ? styles.valid : styles.invalid;
      case 'phone':
        return isVerified ? styles.valid : '';
      case 'permissionNumber':
        return permissionCheckMessage?.includes('사용 가능한') ? styles.valid : styles.invalid;
      default:
        return '';
    }
  };

  return (
    <div className={styles.riderSignup}>
      <h2>회원가입 (라이더)</h2>
      <form onSubmit={handleSubmit} className={styles.signupForm}>
        {/* 아이디 */}
        <Input
          label="아이디"
          required
          type="text"
          id="loginId"
          name="loginId"
          placeholder="아이디를 입력하세요"
          value={form.loginId}
          onChange={handleChange}
          error={loginIdCheckError}
          success={loginIdCheckMessage}
          className={getInputClassName('loginId')}
        />

        {/* 이름 */}
        <Input
          label="이름"
          required
          type="text"
          id="name"
          name="name"
          placeholder="이름을 입력하세요"
          value={form.name}
          onChange={handleChange}
        />

        {/* 비밀번호 */}
        <PasswordSection
          password={form.password}
          passwordConfirm={form.passwordConfirm}
          onPasswordChange={handleChange}
          onPasswordConfirmChange={handleChange}
        />

        {/* 휴대폰 인증 */}
        <PhoneVerification
          phone={form.phone}
          verificationCode={verificationCode}
          onPhoneChange={handleChange}
          onVerificationCodeChange={e => setVerificationCode(e.target.value)}
        />

        {/* 면허번호 */}
        <Input
          label="면허번호"
          required
          type="text"
          id="permissionNumber"
          name="permissionNumber"
          placeholder="면허번호를 입력하세요 (12자리 숫자)"
          value={form.permissionNumber}
          onChange={handleChange}
          maxLength={12}
          error={
            form.permissionNumber && form.permissionNumber.length < 12
              ? '면허번호 12자리를 모두 입력해주세요.'
              : permissionCheckError
          }
          success={form.permissionNumber.length === 12 ? permissionCheckMessage : ''}
          className={getInputClassName('permissionNumber')}
        />

        <button type="submit" disabled={loading} className={styles.submitButton}>
          {loading ? '처리 중...' : '회원가입'}
        </button>

        {error && <div className={styles.errorMessage}>{error}</div>}
      </form>
    </div>
  );
}

export default RiderSignUp;
