import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../SignInPage.module.scss';

function SignUpLink() {
  const navigate = useNavigate();
  return (
    <div className={styles.signupLink}>
      계정이 없나요? <button onClick={() => navigate('/auth/signup')}>회원가입</button>
    </div>
  );
}

export default SignUpLink;
