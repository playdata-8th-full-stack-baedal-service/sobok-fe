import React, { useState, useEffect } from 'react';
import Input from '../../components/Input';


function PasswordSection({
  password,
  passwordConfirm,
  onPasswordChange,
  onPasswordConfirmChange,
  disabled,
}) {
  // 비밀번호 검증 상태 관리
  const [passwordValidation, setPasswordValidation] = useState({
    isValid: false,
    isMatching: false,
    showValidation: false,
    showMatchValidation: false,
  });

  // 비밀번호 유효성 검사 함수
  const validatePassword = password => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,16}$/;
    return passwordRegex.test(password);
  };

  // 비밀번호 입력 처리
  const handlePasswordChange = e => {
    const newPassword = e.target.value;
    onPasswordChange(e); // 부모 컴포넌트의 핸들러 호출

    // 비밀번호 유효성 검사
    const isValid = validatePassword(newPassword);
    const isMatching = newPassword === passwordConfirm;

    setPasswordValidation({
      isValid,
      isMatching,
      showValidation: newPassword.length > 0,
      showMatchValidation: passwordConfirm.length > 0,
    });
  };

  // 비밀번호 확인 입력 처리
  const handlePasswordConfirmChange = e => {
    const newPasswordConfirm = e.target.value;
    onPasswordConfirmChange(e); // 부모 컴포넌트의 핸들러 호출

    // 비밀번호 일치 확인
    const isMatching = password === newPasswordConfirm;

    setPasswordValidation(prev => ({
      ...prev,
      isMatching,
      showMatchValidation: newPasswordConfirm.length > 0,
    }));
  };

  // password prop이 변경될 때 검증 상태 업데이트
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
      <div style={{ position: 'relative' }}>
        <Input
          label="비밀번호"
          required
          type="password"
          id="password"
          name="password"
          value={password}
          onChange={handlePasswordChange}
          disabled={disabled}
          placeholder="대소문자, 숫자, 특수문자 포함 8~16자"
          className='passwordzone'
        />
        {passwordValidation.showValidation && (
          <div style={{ marginTop: '10px', marginBottom: '10px' }}>
            <p
              style={{
                color: passwordValidation.isValid ? 'green' : 'red',
                fontSize: '13px',
                fontWeight: 'bold',
                margin: '0',
              }}
            >
              {passwordValidation.isValid
                ? '✓ 사용 가능한 비밀번호입니다!'
                : '✗ 대소문자, 숫자, 특수문자(@$!%*?&)를 포함하여 8~16자로 입력해주세요.'}
            </p>
          </div>
        )}
      </div>

      <div style={{ position: 'relative' }}>
        <Input
          label="비밀번호 확인"
          required
          type="password"
          id="passwordConfirm"
          value={passwordConfirm}
          onChange={handlePasswordConfirmChange}
          disabled={disabled}
          placeholder="비밀번호를 다시 입력해주세요"
          className='passwordzone'
        />
        {passwordValidation.showMatchValidation && (
          <div style={{ marginTop: '10px', marginBottom: '10px' }}>
            <p
              style={{
                color: passwordValidation.isMatching ? 'green' : 'red',
                fontSize: '13px',
                fontWeight: 'bold',
                margin: '0',
              }}
            >
              {passwordValidation.isMatching
                ? '✓ 비밀번호가 일치합니다!'
                : '✗ 비밀번호가 일치하지 않습니다.'}
            </p>
          </div>
        )}
      </div>
    </>
  );
}

export default PasswordSection;