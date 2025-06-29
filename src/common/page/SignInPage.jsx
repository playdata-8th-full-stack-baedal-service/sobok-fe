import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../store/authSlice';

function SignInPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const auth = useSelector(state => state.auth);

  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const handleSignIn = () => {
    dispatch(loginUser({ id, password }))
      .unwrap()
      .then(({ role }) => {
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
      })
      .catch(() => {
        // 오류는 auth.error에서 자동 관리됨
      });
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

      <div className="socialLogin">
        <h3 className="socialTitle">소셜 로그인하기</h3>
        <button className="socialBtn kakao">kakao로 계속하기</button>
        <button className="socialBtn google">Google로 계속하기</button>
        <button className="socialBtn naver">Naver로 계속하기</button>
      </div>

      <hr className="divider" />

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

        {auth.error && <p className="error">{auth.error}</p>}

        <button className="signInButton" onClick={handleSignIn} disabled={auth.loading}>
          {auth.loading ? '로그인 중...' : 'SIGN IN'}
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

export default SignInPage;
