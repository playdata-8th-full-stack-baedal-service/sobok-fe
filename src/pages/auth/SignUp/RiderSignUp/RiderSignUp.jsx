import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  clearSignUpSuccess,
  riderSignUp,
  checkPermission,
  clearPermissionCheck,
} from '@/store/riderSlice';
import { clearSMSAuth } from '@/store/smsAuthSlice';
import { checkLoginId, clearLoginIdCheck, clearAllChecks } from '@/store/authSlice';
import styles from './RiderSignUp.module.scss';
import useToast from '@/common/hooks/useToast';
import PhoneVerification from '../../../../common/forms/Phone/PhoneVerification';
import PasswordSection from '../../../../common/forms/PasswordConfirm/PasswordSection';
import Input from '../../../../common/components/Input';
import { useNavigate } from 'react-router-dom';

function RiderSignUp() {
  const [resetPasswordValidation, setResetPasswordValidation] = useState(false);
  const dispatch = useDispatch();
  const { showSuccess, showNegative } = useToast();
  const navigate = useNavigate();

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
  const [nameError, setNameError] = useState(''); // 이름 에러 상태 추가
  const [loginIdError, setLoginIdError] = useState(''); // 아이디 에러 상태 추가
  
  const loginIdTimer = useRef(null);
  const permissionTimer = useRef(null);

  // 아이디 유효성 검사 함수
  const validateLoginId = (loginId) => {
    if (!loginId || !loginId.trim()) {
      return '';
    }

    const trimmedId = loginId.trim();
    
    // 길이 체크 (4-20자)
    if (trimmedId.length < 4) {
      return '아이디는 4자 이상이어야 합니다.';
    }
    
    if (trimmedId.length > 20) {
      return '아이디는 20자 이하로 입력해주세요.';
    }

    // 영문자로 시작해야 함
    if (!/^[a-zA-Z]/.test(trimmedId)) {
      return '아이디는 영문자로 시작해야 합니다.';
    }

    // 영문자와 숫자만 허용
    if (!/^[a-zA-Z0-9]+$/.test(trimmedId)) {
      return '아이디는 영문자와 숫자만 사용 가능합니다.';
    }

    // 앞뒤 공백 체크
    if (loginId !== trimmedId) {
      return '아이디 앞뒤에 공백은 사용할 수 없습니다.';
    }

    return '';
  };

  // 이름 유효성 검사 함수
  const validateName = (name) => {
    if (!name || !name.trim()) {
      return '';
    }

    const trimmedName = name.trim();
    
    // 길이 체크 (1-20자)
    if (trimmedName.length > 20) {
      return '이름은 20자 이하로 입력해주세요.';
    }

    // 특수문자나 숫자 포함 체크
    if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?0-9]/.test(trimmedName)) {
      return '이름에는 특수문자나 숫자를 사용할 수 없습니다.';
    }

    // 자음만 있는지 체크
    if (/[ㄱ-ㅎ]/.test(trimmedName)) {
      return '완성되지 않은 한글은 사용할 수 없습니다.';
    }

    // 모음만 있는지 체크
    if (/[ㅏ-ㅣ]/.test(trimmedName)) {
      return '완성되지 않은 한글은 사용할 수 없습니다.';
    }

    // 한글이나 영문이 아닌 문자 체크
    if (!/^[가-힣a-zA-Z\s]+$/.test(trimmedName)) {
      return '한글 또는 영문만 입력 가능합니다.';
    }

    // 연속된 공백 체크
    if (/\s{2,}/.test(trimmedName)) {
      return '연속된 공백은 사용할 수 없습니다.';
    }

    // 앞뒤 공백 체크
    if (name !== trimmedName) {
      return '이름 앞뒤에 공백은 사용할 수 없습니다.';
    }

    // 공백만으로 이루어진 경우  
    if (trimmedName.replace(/\s/g, '').length === 0) {
      return '올바른 이름을 입력해주세요.';
    }

    return '';
  };

  // 폼 초기화
  useEffect(() => {
    dispatch(clearAllChecks());
    dispatch(clearSMSAuth());
  }, [dispatch]);

  // 회원가입 성공 시 초기화
  useEffect(() => {
    if (signUpSuccess) {
      showSuccess('회원가입 신청이 완료되었습니다!');
      navigate(-1);
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
      setNameError('');
      setLoginIdError('');
      setResetPasswordValidation(prev => !prev);
    }
  }, [signUpSuccess, dispatch, showSuccess, navigate]);

  // 아이디 자동 검사
  useEffect(() => {
    if (loginIdTimer.current) clearTimeout(loginIdTimer.current);
    
    // 아이디 유효성 검사 먼저 실행
    const idError = validateLoginId(form.loginId);
    setLoginIdError(idError);
    
    if (!form.loginId.trim() || idError) {
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
    
    // 면허번호는 숫자만 허용
    if (name === 'permissionNumber' && !/^\d*$/.test(value)) return;
    
    // 아이디는 영문자와 숫자만 허용 (입력 시점에서 차단)
    if (name === 'loginId' && !/^[a-zA-Z0-9]*$/.test(value)) return;

    setForm(prev => ({
      ...prev,
      [name]: value,
    }));

    // 아이디 유효성 검사
    if (name === 'loginId') {
      const error = validateLoginId(value);
      setLoginIdError(error);
    }

    // 이름 유효성 검사
    if (name === 'name') {
      const error = validateName(value);
      setNameError(error);
    }
  };

  // 필수 입력값 및 인증 체크
  const validateForm = () => {
    const { loginId, password, passwordConfirm, name, phone, permissionNumber } = form;

    if (!loginId || !password || !passwordConfirm || !name || !phone || !permissionNumber) {
      showNegative('필수 항목을 모두 입력해주세요.');
      return false;
    }

    // 아이디 유효성 검사
    if (loginIdError) {
      showNegative('올바른 아이디를 입력해주세요.');
      return false;
    }

    // 이름 유효성 검사
    if (nameError) {
      showNegative('올바른 이름을 입력해주세요.');
      return false;
    }

    if (!isVerified) {
      showNegative('휴대폰 인증을 완료해주세요.');
      return false;
    }

    return true;
  };

  const handleSubmit = e => {
    e.preventDefault();

    if (!validateForm()) return;

    const { passwordConfirm, ...signUpData } = form;
    dispatch(riderSignUp(signUpData));
  };

  const getInputClassName = fieldName => {
    switch (fieldName) {
      case 'loginId':
        if (loginIdError) return styles.invalid;
        return loginIdCheckMessage?.includes('사용 가능한') ? styles.valid : styles.invalid;
      case 'name':
        if (!form.name.trim()) return '';
        return nameError ? styles.invalid : styles.valid;
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
          placeholder="아이디를 입력하세요 (영문자로 시작, 영문+숫자)"
          value={form.loginId}
          onChange={handleChange}
          error={loginIdError || loginIdCheckError}
          success={!loginIdError && loginIdCheckMessage ? loginIdCheckMessage : ''}
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
          error={nameError}
          success={form.name.trim() && !nameError ? '사용 가능한 이름입니다.' : ''}
          className={getInputClassName('name')}
        />

        {/* 비밀번호 */}
        <PasswordSection
          password={form.password}
          passwordConfirm={form.passwordConfirm}
          onPasswordChange={handleChange}
          onPasswordConfirmChange={handleChange}
          reset={resetPasswordValidation}
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