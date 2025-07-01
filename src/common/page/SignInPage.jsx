import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loginUser } from '../../store/authSlice';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import styles from './SignInPage.module.scss';

function SignInPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const idInputRef = useRef();

  const handleSignIn = async () => {
    setError('');
    try {
      const resultAction = await dispatch(loginUser({ id, password }));
      if (loginUser.fulfilled.match(resultAction)) {
        const role = resultAction.payload.role;

        switch (role) {
          case 'ADMIN':
            navigate('/admin/');
            break;
          case 'RIDER':
            navigate('/rider/');
            break;
          case 'HUB':
            navigate('/hub/');
            break;
          default:
            navigate('/');
        }
      } else {
        setError(resultAction.payload || '로그인에 실패했습니다.');
        setPassword('');
        idInputRef.current?.select();
      }
    } catch (err) {
      setError('로그인에 실패했습니다.');
    }
  };

  const handleFindId = () => navigate('/auth/find-id');
  const handleFindPw = () => navigate('/auth/find-password');
  const handleSignUp = () => navigate('/auth/signup');
  const handleKeyDown = e => {
    if (e.key === 'Enter') handleSignIn();
  };

  return (
    <div className={styles.container}>
      <div className={styles.socialLogin}>
        <h3 className={styles.socialTitle}>소셜 로그인하기</h3>
        <button className={styles.socialBtn}>
          <img src="/assets/kakao.png" alt="kakao" /> Kakao로 계속하기
        </button>
        <button className={styles.socialBtn}>
          <img src="/assets/google.png" alt="google" /> Google로 계속하기
        </button>
        <button className={styles.socialBtn}>
          <img src="/assets/naver.png" alt="naver" /> Naver로 계속하기
        </button>
      </div>

      <hr className={styles.divider} />

      <div className={styles.inputBox}>
        <div className={styles.inputHeader}>
          <label htmlFor="id">ID</label>
          <label className={styles.rememberMe}>
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={() => setRememberMe(!rememberMe)}
            />
            로그인 정보 저장
          </label>
        </div>
        <div className={styles.inputGroup}>
          <input
            id="id"
            type="text"
            placeholder="아이디를 입력해 주세요."
            value={id}
            onChange={e => setId(e.target.value)}
            onKeyDown={handleKeyDown}
            ref={idInputRef} // ref 연결
          />
        </div>

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
            onKeyDown={handleKeyDown}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? '비밀번호 숨기기' : '비밀번호 보기'}
          >
            {showPassword ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
          </button>
        </div>

        <div className={styles.helperLinks}>
          <button onClick={handleFindId}>아이디 찾기</button>
          <span> / </span>
          <button onClick={handleFindPw}>비밀번호 찾기</button>
        </div>

        <button className={styles.signInButton} onClick={handleSignIn}>
          SIGN IN
        </button>
      </div>

      <p className={styles.error}>{error || '\u00A0'}</p>

      <div className={styles.signupLink}>
        계정이 없나요? <button onClick={handleSignUp}>회원가입</button>
      </div>
    </div>
  );
}

export default SignInPage;
