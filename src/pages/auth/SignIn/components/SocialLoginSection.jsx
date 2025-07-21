import React from 'react';
import { RiKakaoTalkFill } from 'react-icons/ri';
import styles from '../SignInPage.module.scss';
import { FaGoogle } from 'react-icons/fa';
import { SiNaver } from 'react-icons/si';

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
      <button className={styles.socialBtnone} onClick={handleKakaoLogin}>
        <RiKakaoTalkFill /> Kakao로 계속하기
      </button>
      <button className={styles.socialBtntwo} onClick={handleGoogleLogin}>
        <FaGoogle/> Google로 계속하기
      </button>
    </div>
  );
}

export default SocialLoginSection;
