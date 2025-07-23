import React, { useEffect, useState } from 'react';
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

function RiderSignUp() {
  const dispatch = useDispatch();
  const { showSuccess, showNegative, showInfo } = useToast();

  const { loading, error, signUpSuccess } = useSelector(state => state.rider);
  const {
    permissionCheckLoading,
    permissionCheckError,
    permissionCheckSuccess,
    permissionCheckMessage,
  } = useSelector(state => state.rider);
  const {
    isVerified,
    isCodeSent,
    loading: smsLoading,
    error: smsError,
  } = useSelector(state => state.smsAuth);
  const {
    loginIdCheckMessage,
    loginIdCheckError,
    loading: loginIdCheckLoading,
  } = useSelector(state => state.auth);

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

  useEffect(() => {
    if (signUpSuccess) {
      showSuccess('회원가입 성공!');
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

    if (name === 'permissionNumber') {
      if (!/^\d*$/.test(value)) return;
    }

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
        passwordMatch: value === form.password,
      }));
    }

    if (name === 'permissionNumber') {
      setValidation(prev => ({
        ...prev,
        permissionNumberValid: validatePermissionNumber(value),
      }));
    }
  };

  const checkLoginIdAvailability = () => {
    if (!form.loginId.trim()) {
      showNegative('아이디를 입력해주세요.');
      return;
    }
    dispatch(checkLoginId(form.loginId));
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

    if (!validation.passwordValid) {
      showNegative('비밀번호는 8자 이상이며, 대문자, 특수문자, 숫자를 포함해야 합니다.');
      return;
    }

    if (!validation.passwordMatch) {
      showNegative('비밀번호가 일치하지 않습니다.');
      return;
    }

    if (!isVerified) {
      showNegative('휴대폰 인증을 완료해주세요.');
      return;
    }

    if (!validation.permissionNumberValid) {
      showNegative('면허번호는 숫자 12자리로 정확히 입력해주세요.');
      return;
    }

    if (!loginIdCheckMessage || !loginIdCheckMessage.includes('사용 가능한')) {
      showNegative('아이디 중복 확인을 완료해주세요.');
      return;
    }

    if (!permissionCheckMessage || !permissionCheckMessage.includes('사용 가능한')) {
      showNegative('면허번호 중복 확인을 완료해주세요.');
      return;
    }

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
            <button
              type="button"
              onClick={checkLoginIdAvailability}
              className={styles.verifyButton}
              disabled={loginIdCheckLoading}
            >
              {loginIdCheckLoading ? '확인 중...' : '중복확인'}
            </button>
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

        <div className={styles.formGroup}>
          <label htmlFor="password">비밀번호</label>
          <div className={styles.passwordGroup}>
            <div className={styles.passwordInput}>
              <input
                type="password"
                name="password"
                placeholder="비밀번호를 입력하세요"
                value={form.password}
                onChange={handleChange}
                className={getInputClassName('password')}
                required
                id="password"
              />
              {form.password && (
                <div
                  className={`${styles.validationMessage} ${
                    validation.passwordValid ? styles.valid : styles.invalid
                  }`}
                >
                  <span className={styles.icon}>{validation.passwordValid ? '✓' : '✗'}</span>
                  {validation.passwordValid
                    ? '유효한 비밀번호입니다'
                    : '대문자, 특수문자, 숫자 포함 8자 이상 입력해주세요'}
                </div>
              )}
            </div>

            <div className={styles.passwordInput}>
              <input
                type="password"
                name="passwordConfirm"
                placeholder="비밀번호 확인"
                value={form.passwordConfirm}
                onChange={handleChange}
                className={getInputClassName('passwordConfirm')}
                required
              />
              {form.passwordConfirm && (
                <div
                  className={`${styles.validationMessage} ${
                    validation.passwordMatch ? styles.valid : styles.invalid
                  }`}
                >
                  <span className={styles.icon}>{validation.passwordMatch ? '✓' : '✗'}</span>
                  {validation.passwordMatch
                    ? '비밀번호가 일치합니다'
                    : '비밀번호가 일치하지 않습니다'}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="phone">휴대폰 번호</label>
          <div className={styles.phoneGroup}>
            <div className={styles.phoneInputs}>
              <div className={styles.phoneVerify}>
                <input
                  name="phone"
                  placeholder="전화번호 (숫자만)"
                  value={form.phone}
                  onChange={handleChange}
                  className={getInputClassName('phone')}
                  required
                  id="phone"
                />
                <button
                  type="button"
                  onClick={sendVerificationCode}
                  className={styles.verifyButton}
                  disabled={smsLoading}
                >
                  {smsLoading ? '전송 중...' : isCodeSent ? '재전송' : '인증하기'}
                </button>
              </div>

              <div className={styles.codeVerify}>
                <input
                  type="text"
                  placeholder="인증번호를 입력하세요"
                  value={verificationCode}
                  onChange={e => setVerificationCode(e.target.value)}
                />
                <button type="button" onClick={verifyCode} className={styles.verifyButton}>
                  확인
                </button>
              </div>
            </div>

            {isVerified && (
              <div className={`${styles.validationMessage} ${styles.valid}`}>
                <span className={styles.icon}>✓</span>
                휴대폰 인증이 완료되었습니다
              </div>
            )}

            {smsError && <div className={styles.errorMessage}>인증 오류: {smsError}</div>}
          </div>
        </div>

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
