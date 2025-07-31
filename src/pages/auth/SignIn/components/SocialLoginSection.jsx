import React from 'react';
import { RiKakaoTalkFill } from 'react-icons/ri';
import { FaGoogle } from 'react-icons/fa';
import { SiNaver } from 'react-icons/si';
import styles from '../SignInPage.module.scss';
import kakao from '../../../../../public/kakao_login_medium_wide.png';

// 환경변수에서 가져오기
const KAKAO_CLIENT_ID = import.meta.env.VITE_KAKAO_CLIENT_ID;
const KAKAO_REDIRECT_URI = import.meta.env.VITE_KAKAO_REDIRECT_URI;

function SocialLoginSection() {
  // 카카오 로그인 처리
  const handleKakaoLogin = () => {
    console.log('카카오 로그인 버튼 클릭!');
    const popup = window.open(
      `https://kauth.kakao.com/oauth/authorize?client_id=${KAKAO_CLIENT_ID}&redirect_uri=${KAKAO_REDIRECT_URI}&response_type=code&prompt=login`,
      'kakao-login',
      'width=500,height=600,scrollbars=yes,resizable=yes'
    );
  };

  const handleGoogleLogin = async () => {
    try {
      console.log('구글 로그인 버튼 클릭!');

      // 1. 백엔드에 로그인 URL 요청
      const response = await fetch('http://localhost:8000/api-service/api/google-login-view');
      const result = await response.json();
      console.log('result:', result);

      const googleLoginUrl = result.data; // ApiResponse<String> 구조일 때

      // 2. 해당 URL로 팝업 열기
      const popup = window.open(
        googleLoginUrl,
        'google-login',
        'width=500,height=600,scrollbars=yes,resizable=yes'
      );
    } catch (err) {
      console.error('구글 로그인 요청 실패:', err);
    }
  };

  return (
    <div className={styles.socialLogin}>
      <h3 className={styles.socialTitle}>소셜 로그인하기</h3>
      <img src={kakao} onClick={handleKakaoLogin} className={styles.kakaobutton} />
      <button className={styles.gsiMaterialButton} style={{ width: '300px' }} onClick={handleGoogleLogin} >
        <div className={styles.gsiMaterialButtonState} />
        <div className={styles.gsiMaterialButtonContentWrapper}>
          <div className={styles.gsiMaterialButtonIcon}>
            <svg
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 48 48"
              style={{ display: 'block', cursor : 'pointer' }}
            >
              <path
                fill="#EA4335"
                d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 
           14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
              />
              <path
                fill="#4285F4"
                d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 
           2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 
           7.09-17.65z"
              />
              <path
                fill="#FBBC05"
                d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 
           16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
              />
              <path
                fill="#34A853"
                d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 
           1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 
           6.19C6.51 42.62 14.62 48 24 48z"
              />
              <path fill="none" d="M0 0h48v48H0z" />
            </svg>
          </div>
          <span className={styles.gsiMaterialButtonContents}>Sign in with Google</span>
          <span style={{ display: 'none' }}>Sign in with Google</span>
        </div>
      </button>
    </div>
  );
}

export default SocialLoginSection;
