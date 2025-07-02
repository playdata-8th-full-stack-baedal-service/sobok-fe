import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { clearSignUpSuccess, riderSignUp } from '../../store/riderSlice';
import axios from 'axios';
import styles from './RiderSignUp.module.scss';

function RiderSignUp() {
  const dispatch = useDispatch();
  const { loading, error, signUpSuccess } = useSelector(state => state.rider);

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
  });

  const [verificationCode, setVerificationCode] = useState('');
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);

  useEffect(() => {
    if (signUpSuccess) {
      alert('회원가입 성공!');
      dispatch(clearSignUpSuccess());
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
      });
      setVerificationCode('');
      setIsPhoneVerified(false);
    }
  }, [signUpSuccess, dispatch]);

  // 비밀번호 유효성 검증 (대문자, 특수문자, 숫자 포함)
  const validatePassword = password => {
    const regex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*[0-9]).{8,}$/;
    return regex.test(password);
  };

  // input 클래스 결정 함수
  const getInputClassName = fieldName => {
    let className = '';

    switch (fieldName) {
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
        if (isPhoneVerified) {
          className = styles.valid;
        }
        break;
      default:
        break;
    }

    return className;
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value,
    }));

    // 비밀번호 관련 유효성 검사
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
  };

  // 휴대폰 인증 (fetch → axios 변경)
  const sendVerificationCode = async () => {
    if (!form.phone.trim()) {
      alert('휴대폰 번호를 입력해주세요.');
      return;
    }

    try {
      const response = await axios.post('/auth-service/auth/send-verification', {
        phone: form.phone
      });

      alert('인증번호가 발송되었습니다.');
    } catch (error) {
      console.error('인증번호 발송 에러:', error);
      alert(error.response?.data?.message || '인증번호 발송 중 오류가 발생했습니다.');
    }
  };

  // 인증번호 확인 (fetch → axios 변경)
  const verifyCode = async () => {
    if (!verificationCode.trim()) {
      alert('인증번호를 입력해주세요.');
      return;
    }

    try {
      const response = await axios.post('/auth-service/auth/verify-code', {
        phone: form.phone,
        code: verificationCode,
      });

      if (response.data.valid) {
        setIsPhoneVerified(true);
        alert('휴대폰 인증이 완료되었습니다.');
      } else {
        alert(response.data.message || '인증번호가 올바르지 않습니다.');
      }
    } catch (error) {
      console.error('인증번호 확인 에러:', error);
      alert(error.response?.data?.message || '인증번호 확인 중 오류가 발생했습니다.');
    }
  };

  const handleSubmit = e => {
    e.preventDefault();

    if (!validation.passwordValid) {
      alert('비밀번호는 8자 이상이며, 대문자, 특수문자, 숫자를 포함해야 합니다.');
      return;
    }

    if (!validation.passwordMatch) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }

    if (!isPhoneVerified) {
      alert('휴대폰 인증을 완료해주세요.');
      return;
    }

    // 회원가입 데이터 (passwordConfirm 제외)
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
            />
          </div>
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
                  className={`${styles.validationMessage} ${validation.passwordValid ? styles.valid : styles.invalid}`}
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
                  className={`${styles.validationMessage} ${validation.passwordMatch ? styles.valid : styles.invalid}`}
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
                >
                  인증하기
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
                  인증확인
                </button>
              </div>
            </div>
            {isPhoneVerified && (
              <div className={`${styles.validationMessage} ${styles.valid}`}>
                <span className={styles.icon}>✓</span>
                휴대폰 인증이 완료되었습니다
              </div>
            )}
          </div>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="permissionNumber">면허번호</label>
          <div className={styles.inputWrapper}>
            <input
              name="permissionNumber"
              placeholder="면허번호를 입력하세요"
              value={form.permissionNumber}
              onChange={handleChange}
              required
              id="permissionNumber"
            />
          </div>
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