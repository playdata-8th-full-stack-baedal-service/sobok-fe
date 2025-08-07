import React, { useState, useEffect } from 'react';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import Input from '../../components/Input';
import styles from './PasswordSection.module.scss';

function PasswordSection({
  password,
  passwordConfirm,
  onPasswordChange,
  onPasswordConfirmChange,
  disabled,
  reset,
  hideLabels = false,
  showrequired = true,
}) {
  const [passwordValidation, setPasswordValidation] = useState({
    isValid: false,
    isMatching: false,
    showValidation: false,
    showMatchValidation: false,
  });

  // 패스워드 리셋
  useEffect(() => {
    if (reset) {
      setPasswordValidation({
        isValid: false,
        isMatching: false,
        showValidation: false,
        showMatchValidation: false,
      });
    }
  }, [reset]);

  // 비밀번호 보이기/숨기기 상태
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validatePassword = password => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,16}$/;
    return passwordRegex.test(password);
  };

  const handlePasswordChange = e => {
    const newPassword = e.target.value;
    onPasswordChange(e);

    const isValid = validatePassword(newPassword);
    const isMatching = newPassword === passwordConfirm;

    setPasswordValidation({
      isValid,
      isMatching,
      showValidation: newPassword.length > 0,
      showMatchValidation: passwordConfirm.length > 0,
    });
  };

  const handlePasswordConfirmChange = e => {
    const newPasswordConfirm = e.target.value;
    onPasswordConfirmChange(e);

    const isMatching = password === newPasswordConfirm;

    setPasswordValidation(prev => ({
      ...prev,
      isMatching,
      showMatchValidation: newPasswordConfirm.length > 0,
    }));
  };

  useEffect(() => {
    const isValid = validatePassword(password);
    const isMatching = password === passwordConfirm;

    setPasswordValidation(prev => ({
      ...prev,
      isValid,
      isMatching,
      showValidation: password.length > 0,
    }));
  }, [password, passwordConfirm]);

  return (
    <>
      {/* 비밀번호 */}
      <div style={{ position: 'relative' }} className={hideLabels ? styles.noLabelWrapper : ''}>
        <Input
          label={hideLabels ? '' : '비밀번호'}
          required={showrequired}
          type={showPassword ? 'text' : 'password'}
          id="password"
          name="password"
          value={password}
          onChange={handlePasswordChange}
          disabled={disabled}
          placeholder="대소문자, 숫자, 특수문자 포함 8~16자"
          success={passwordValidation.isValid ? '사용 가능한 비밀번호입니다.' : ''}
          error={
            !passwordValidation.isValid && passwordValidation.showValidation
              ? '대소문자, 숫자, 특수문자 포함 8~16자'
              : ''
          }
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          aria-label={showPassword ? '비밀번호 숨기기' : '비밀번호 보기'}
          className={styles.eyeButton}
        >
          {showPassword ? <AiOutlineEye size={20} /> : <AiOutlineEyeInvisible size={20} />}
        </button>
      </div>

      {/* 비밀번호 확인 */}
      <div style={{ position: 'relative' }} className={hideLabels ? styles.noLabelWrapper : ''}>
        <Input
          label={hideLabels ? '' : '비밀번호 확인'}
          required={showrequired}
          type={showConfirmPassword ? 'text' : 'password'}
          id="passwordConfirm"
          name="passwordConfirm"
          value={passwordConfirm}
          onChange={handlePasswordConfirmChange}
          disabled={disabled}
          placeholder="비밀번호를 다시 입력해주세요"
          success={
            passwordValidation.isMatching && passwordValidation.showMatchValidation
              ? '비밀번호가 일치합니다.'
              : ''
          }
          error={
            !passwordValidation.isMatching && passwordValidation.showMatchValidation
              ? '비밀번호가 일치하지 않습니다.'
              : ''
          }
        />
        <button
          type="button"
          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          aria-label={showConfirmPassword ? '비밀번호 숨기기' : '비밀번호 보기'}
          className={styles.eyeButton}
        >
          {showConfirmPassword ? <AiOutlineEye size={20} /> : <AiOutlineEyeInvisible size={20} />}
        </button>
      </div>
    </>
  );
}

export default PasswordSection;
