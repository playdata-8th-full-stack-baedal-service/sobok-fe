import React from 'react';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import Input from '../../../../common/components/Input';
import styles from './PasswordInput.module.scss';

function PasswordInput({
  password,
  setPassword,
  showPassword,
  setShowPassword,
  onKeyDown,
  showLabel = true,
  labelText = 'Password',
  inputId = 'userpassword',
  placeholder = '비밀번호를 입력해 주세요.',
  wrapperClassName = '',
}) {
  return (
    <div className={`${styles.passwordWrapper} ${wrapperClassName}`}>
      <div className={styles.inputHeader}>
        {showLabel && <label htmlFor={inputId}>{labelText}</label>}
      </div>

      <div className={styles.inputButtonGroup}>
        <Input showLabel={false}>
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder={placeholder}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? '비밀번호 숨기기' : '비밀번호 보기'}
          >
            {showPassword ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
          </button>
        </Input>
      </div>
    </div>
  );
}

export default PasswordInput;
