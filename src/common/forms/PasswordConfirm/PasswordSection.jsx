import React from 'react';
import Input from '../../components/Input';

function PasswordSection({
  password,
  passwordConfirm,
  onPasswordChange,
  onPasswordConfirmChange,
  disabled,
}) {
  const isPasswordValid = /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*[0-9]).{8,}$/.test(password);
  const isPasswordMatch = password === passwordConfirm;
  const showPasswordMismatch = passwordConfirm && !isPasswordMatch;

  return (
    <>
      <Input
        label="비밀번호"
        required
        type="password"
        id="password"
        name="password"
        value={password}
        onChange={onPasswordChange}
        disabled={disabled}
        error={
          !isPasswordValid && password
            ? '비밀번호는 8자 이상, 대문자/숫자/특수문자를 포함해야 합니다.'
            : ''
        }
      />

      <Input
        label="비밀번호 확인"
        required
        type="password"
        id="passwordConfirm"
        name="passwordConfirm"
        value={passwordConfirm}
        onChange={onPasswordConfirmChange}
        disabled={disabled}
        error={showPasswordMismatch ? '비밀번호가 일치하지 않습니다.' : ''}
        success={isPasswordMatch && passwordConfirm ? '비밀번호가 일치합니다.' : ''}
      />
    </>
  );
}

export default PasswordSection;
