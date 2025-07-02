import React from 'react';
import styles from '../SignInPage.module.scss';

function SocialLoginSection() {
  return (
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
  );
}

export default SocialLoginSection;
