import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import styles from './SignInPage.module.scss';
import axiosInstance from '../../services/axios-config';
import { AUTH } from '../../services/host-config';

function SignInPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const idInputRef = useRef(); // 아이디 입력창에 전체 선택 효과를 주기 위한 ref

  const handleSignIn = async () => {
    setError(''); // 에러 초기화

    try {
      const response = await axiosInstance.post(`${AUTH}/login`, {
        loginId: id,
        password: password,
      });

      const { data } = response.data;

      if (data.recoveryTarget) {
        setError('해당 계정은 복구 대상입니다.');
        return;
      }

      const { accessToken, refreshToken, role } = data;

      // 토큰 저장
      localStorage.setItem('ACCESS_TOKEN', accessToken);
      localStorage.setItem('REFRESH_TOKEN', refreshToken);

      // 역할에 따라 라우팅
      switch (role) {
        case 'ADMIN':
          navigate('/admin/main');
          break;
        case 'RIDER':
          navigate('/rider/main');
          break;
        case 'HUB':
          navigate('/hub/main');
          break;
        default:
          navigate('/');
      }
    } catch (err) {
      console.log('로그인 에러 응답:', err?.response?.data);
      const res = err?.response?.data;

      if (res?.message === '존재하지 않는 아이디입니다.') {
        setError('존재하지 않는 아이디입니다.');
      } else if (res?.message === '비밀번호가 틀렸습니다.') {
        setError('비밀번호가 틀렸습니다.');
      } else if (res?.message === '존재하지 않는 사용자입니다.') {
        setError('존재하지 않는 사용자입니다.');
      } else if (res?.message === '토큰 생성 과정에서 오류가 발생했습니다.') {
        setError('서버 오류로 로그인에 실패했습니다.');
      } else {
        setError('로그인에 실패했습니다.');
      }

      // 로그인 실패 시 패스워드 비우고, 아이디 전체 선택
      setPassword('');
      idInputRef.current?.select();
    }
  };

  const handleFindId = () => navigate('/find-id');
  const handleFindPw = () => navigate('/find-password');
  const handleSignUp = () => navigate('/signup');
  const handleKeyDown = e => {
    if (e.key === 'Enter') handleSignIn(); // 엔터키로 로그인 트리거
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
