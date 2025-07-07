import React from 'react';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import styles from '../SignInPage.module.scss';

function PasswordInput({ password, setPassword, showPassword, setShowPassword, onKeyDown }) {
  return (
    <>
      <label htmlFor="password" className={styles.label}>
        Password
      </label>
      <div className={`${styles.inputGroup} ${styles.passwordInputWrapper}`}>
        <input
          id="password"
          type={showPassword ? 'text' : 'password'}
          placeholder="비밀번호를 입력해 주세요."
          value={password}
          onChange={e => setPassword(e.target.value)}
          onKeyDown={onKeyDown}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          aria-label={showPassword ? '비밀번호 숨기기' : '비밀번호 보기'}
        >
          {showPassword ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
        </button>
      </div>
    </>
  );
}

export default PasswordInput;
