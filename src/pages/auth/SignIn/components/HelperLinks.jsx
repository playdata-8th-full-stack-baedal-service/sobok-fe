import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../SignInPage.module.scss';

function HelperLinks() {
  const navigate = useNavigate();
  return (
    <div className={styles.helperLinks}>
      <button onClick={() => navigate('/auth/find-id')}>아이디 찾기</button>
      <span> / </span>
      <button onClick={() => navigate('/auth/find-password')}>비밀번호 찾기</button>
    </div>
  );
}

export default HelperLinks;
