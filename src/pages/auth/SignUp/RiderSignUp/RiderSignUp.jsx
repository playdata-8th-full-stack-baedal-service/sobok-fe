import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  clearSignUpSuccess,
  riderSignUp,
  checkPermission,
  clearPermissionCheck,
} from '@/store/riderSlice';
import { sendSMSCode, verifySMSCode, clearSMSAuth } from '../../../../store/smsAuthSlice';
import { checkLoginId, clearLoginIdCheck } from '../../../../store/authSlice';
import styles from './RiderSignUp.module.scss';
import useToast from '@/common/hooks/useToast';
import PhoneVerification from '../../../../common/forms/Phone/PhoneVerification';
import PasswordSection from '../../../../common/forms/PasswordConfirm/PasswordSection';

function RiderSignUp() {
  const dispatch = useDispatch();
  const { showSuccess, showNegative } = useToast();

  const { loading, error, signUpSuccess } = useSelector(state => state.rider);
  const {
    permissionCheckLoading,
    permissionCheckError,
    permissionCheckSuccess,
    permissionCheckMessage,
  } = useSelector(state => state.rider);
  const { isVerified, loading: smsLoading } = useSelector(state => state.smsAuth);
  const { loginIdCheckMessage, loginIdCheckError } = useSelector(state => state.auth);

  const [form, setForm] = useState({
    loginId: '',
    password: '',
    passwordConfirm: '',
    name: '',
    phone: '',
    permissionNumber: '',
  });

  const [validation, setValidation] = useState({
    passwordMatch: false,
    passwordValid: false,
    permissionNumberValid: false,
  });

  const [verificationCode, setVerificationCode] = useState('');
  const loginIdTimer = useRef(null);

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
      setValidation({
        passwordMatch: false,
        passwordValid: false,
        permissionNumberValid: false,
      });
      setVerificationCode('');
    }
  }, [signUpSuccess, dispatch]);

  useEffect(() => {
    if (!form.loginId.trim()) {
      if (loginIdTimer.current) clearTimeout(loginIdTimer.current);
      dispatch(clearLoginIdCheck());
      return;
    }

    if (loginIdTimer.current) clearTimeout(loginIdTimer.current);
    loginIdTimer.current = setTimeout(() => {
      dispatch(checkLoginId(form.loginId.trim()));
    }, 400);
  }, [form.loginId, dispatch]);

  const validatePassword = password => {
    const regex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*[0-9]).{8,}$/;
    return regex.test(password);
  };

  const validatePermissionNumber = permissionNumber => {
    const regex = /^\d{12}$/;
    return regex.test(permissionNumber);
  };

  const getInputClassName = fieldName => {
    let className = '';

    switch (fieldName) {
      case 'loginId':
        if (form.loginId && loginIdCheckMessage) {
          className = loginIdCheckMessage.includes('사용 가능한') ? styles.valid : styles.invalid;
        }
        break;
      case 'password':
        if (form.password) {
          className = validation.passwordValid ? styles.valid : styles.invalid;
        }
        break;
      case 'passwordConfirm':
        if (form.passwordConfirm) {
          className = validation.passwordMatch ? styles.valid : styles.invalid;
        }
        break;
      case 'phone':
        if (isVerified) {
          className = styles.valid;
        }
        break;
      case 'permissionNumber':
        if (form.permissionNumber && permissionCheckMessage) {
          className = permissionCheckMessage.includes('사용 가능한')
            ? styles.valid
            : styles.invalid;
        }
        break;
      default:
        break;
    }

    return className;
  };

  const handleChange = e => {
    const { name, value } = e.target;
    if (name === 'permissionNumber' && !/^\d*$/.test(value)) return;

    setForm(prev => ({
      ...prev,
      [name]: value,
    }));

    if (name === 'password') {
      setValidation(prev => ({
        ...prev,
        passwordValid: validatePassword(value),
        passwordMatch: value === form.passwordConfirm,
      }));
    }

    if (name === 'passwordConfirm') {
      setValidation(prev => ({
        ...prev,
        passwordMatch: form.password === value,
      }));
    }

    if (name === 'permissionNumber') {
      setValidation(prev => ({
        ...prev,
        permissionNumberValid: validatePermissionNumber(value),
      }));
    }
  };

  const checkPermissionNumberAvailability = () => {
    if (!form.permissionNumber.trim()) {
      showNegative('면허번호를 입력해주세요.');
      return;
    }
    if (!validatePermissionNumber(form.permissionNumber)) {
      showNegative('면허번호는 숫자 12자리로 입력해주세요.');
      return;
    }
    dispatch(checkPermission(form.permissionNumber));
  };

  const sendVerificationCode = () => {
    if (!form.phone.trim()) {
      showNegative('휴대폰 번호를 입력해주세요.');
      return;
    }
    dispatch(sendSMSCode(form.phone));
  };

  const verifyCode = () => {
    if (!verificationCode.trim()) {
      showNegative('인증번호를 입력해주세요.');
      return;
    }
    dispatch(verifySMSCode({ phoneNumber: form.phone, inputCode: verificationCode }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    const { passwordConfirm, ...signUpData } = form;
    dispatch(riderSignUp(signUpData));
  };

  return (
    <div className={styles.riderSignup}>
      <h2>회원가입 (라이더)</h2>
      <form onSubmit={handleSubmit} className={styles.signupForm}>
        <div className={styles.formGroup}>
          <label htmlFor="loginId">아이디</label>
          <div className={styles.inputWrapper}>
            <input
              name="loginId"
              placeholder="아이디를 입력하세요"
              value={form.loginId}
              onChange={handleChange}
              required
              id="loginId"
              className={getInputClassName('loginId')}
            />
          </div>
          {loginIdCheckMessage && (
            <div
              className={`${styles.validationMessage} ${
                loginIdCheckMessage.includes('사용 가능한') ? styles.valid : styles.invalid
              }`}
            >
              <span className={styles.icon}>
                {loginIdCheckMessage.includes('사용 가능한') ? '✓' : '✗'}
              </span>
              {loginIdCheckMessage}
            </div>
          )}
          {loginIdCheckError && <div className={styles.errorMessage}>{loginIdCheckError}</div>}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="name">이름</label>
          <div className={styles.inputWrapper}>
            <input
              name="name"
              placeholder="이름을 입력하세요"
              value={form.name}
              onChange={handleChange}
              required
              id="name"
            />
          </div>
        </div>

        <PasswordSection
          password={form.password}
          passwordConfirm={form.passwordConfirm}
          onPasswordChange={handleChange}
          onPasswordConfirmChange={handleChange}
        />

        <PhoneVerification
          phone={form.phone}
          verificationCode={verificationCode}
          onPhoneChange={handleChange}
          onVerificationCodeChange={e => setVerificationCode(e.target.value)}
        />

        <div className={styles.formGroup}>
          <label htmlFor="permissionNumber">면허번호</label>
          <div className={styles.inputWrapper}>
            <input
              name="permissionNumber"
              placeholder="면허번호를 입력하세요 (12자리 숫자)"
              value={form.permissionNumber}
              onChange={handleChange}
              className={getInputClassName('permissionNumber')}
              required
              id="permissionNumber"
              maxLength={12}
            />
            <button
              type="button"
              onClick={checkPermissionNumberAvailability}
              className={styles.verifyButton}
              disabled={permissionCheckLoading}
            >
              {permissionCheckLoading ? '확인 중...' : '중복확인'}
            </button>
          </div>
          {permissionCheckMessage && (
            <div
              className={`${styles.validationMessage} ${
                permissionCheckMessage.includes('사용 가능한') ? styles.valid : styles.invalid
              }`}
            >
              <span className={styles.icon}>
                {permissionCheckMessage.includes('사용 가능한') ? '✓' : '✗'}
              </span>
              {permissionCheckMessage}
            </div>
          )}
          {permissionCheckError && (
            <div className={styles.errorMessage}>{permissionCheckError}</div>
          )}
        </div>

        <button type="submit" disabled={loading} className={styles.submitButton}>
          {loading ? '처리 중...' : '회원가입'}
        </button>

        {error && <div className={styles.errorMessage}>{error}</div>}
      </form>
    </div>
  );
}

export default RiderSignUp;
