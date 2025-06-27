import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function SignInPage() {
  const navigate = useNavigate();
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSignIn = async () => {
    try {
      const res = await axios.post('/auth-service/auth/login', {
        loginId: id,
        password: password,
      });

      if (res.data.success) {
        const { accessToken, refreshToken, role, id, recoveryTarget } = res.data.data;

        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        localStorage.setItem('userRole', role);
        localStorage.setItem('userId', id);
        localStorage.setItem('recovery', recoveryTarget);

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
          default: // USER
            navigate('/');
        }
      }
    } catch (err) {
      if (err.response && err.response.data) {
        setErrorMessage(err.response.data.message);
      } else {
        setErrorMessage('로그인 요청에 실패했습니다.');
      }
    }
  };

  const handleFindId = () => navigate('/find-id');
  const handleFindPw = () => navigate('/find-password');
  const handleSignUp = () => navigate('/signup');

  const handleKeyDown = e => {
    if (e.key === 'Enter') handleSignIn();
  };

  return (
    <div className="container">
      <h2 className="title">로그인</h2>

      {/* 소셜 로그인 UI */}
      <div className="socialLogin">
        <h3 className="socialTitle">소셜 로그인하기</h3>
        <button className="socialBtn kakao">kakao로 계속하기</button>
        <button className="socialBtn google">Google로 계속하기</button>
        <button className="socialBtn naver">Naver로 계속하기</button>
      </div>

      <hr className="divider" />

      {/* 일반 로그인 폼 */}
      <div className="inputBox">
        <label htmlFor="id">ID</label>
        <div className="idRow">
          <label className="rememberMe">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={() => setRememberMe(!rememberMe)}
            />
            로그인 정보 저장
          </label>
          <input
            id="id"
            type="text"
            placeholder="아이디를 입력해 주세요."
            value={id}
            onChange={e => setId(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>

        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          placeholder="비밀번호를 입력해 주세요."
          value={password}
          onChange={e => setPassword(e.target.value)}
          onKeyDown={handleKeyDown}
        />

        <div className="helperLinks">
          <button className="findId" onClick={handleFindId}>
            아이디 찾기
          </button>
          <span> / </span>
          <button className="findPw" onClick={handleFindPw}>
            비밀번호 찾기
          </button>
        </div>

        {errorMessage && <p className="error">{errorMessage}</p>}

        <button className="signInButton" onClick={handleSignIn}>
          SIGN IN
        </button>
      </div>

      <div className="signupLink">
        계정이 없나요?{' '}
        <button className="signup" onClick={handleSignUp}>
          회원가입
        </button>
      </div>
    </div>
  );
}
