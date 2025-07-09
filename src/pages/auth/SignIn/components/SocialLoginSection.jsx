import React from 'react';
import styles from '../SignInPage.module.scss';

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

  return (
    <div className={styles.socialLogin}>
      <h3 className={styles.socialTitle}>소셜 로그인하기</h3>
      <button className={styles.socialBtn} onClick={handleKakaoLogin}>
        <img src="/assets/kakao.png" alt="kakao" /> Kakao로 계속하기
      </button>
      <button className={styles.socialBtn}>
        <img src="/assets/google.png" alt="google" /> Google로 계속하기
      </button>
      <button className={styles.socialBtn}>
        <img src="/assets/naver.png" alt="naver" /> Naver로 계속하기
      </button>
    </div>
  );
}

export default SocialLoginSection;
