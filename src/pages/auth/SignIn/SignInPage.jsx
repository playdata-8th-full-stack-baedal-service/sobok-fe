import React, { useState, useRef } from 'react';
import IDInput from './components/IDInput';
import PasswordInput from './components/PasswordInput';
import SocialLoginSection from './components/SocialLoginSection';
import HelperLinks from './components/HelperLinks';
import SignUpLink from './components/SignUpLink';
import useSignInHandlers from './hooks/useSignInHandlers';
import styles from './SignInPage.module.scss';

function SignInPage() {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const idInputRef = useRef();

  const { handleSignIn, handleKeyDown } = useSignInHandlers({
    id,
    password,
    setError,
    setPassword,
    idInputRef,
  });

  return (
    <div className={styles.container}>
      <SocialLoginSection />

      <hr className={styles.divider} />

      <div className={styles.inputBox}>
        <IDInput
          id={id}
          setId={setId}
          rememberMe={rememberMe}
          setRememberMe={setRememberMe}
          onKeyDown={handleKeyDown}
          inputRef={idInputRef}
        />
        <PasswordInput
          password={password}
          setPassword={setPassword}
          showPassword={showPassword}
          setShowPassword={setShowPassword}
          onKeyDown={handleKeyDown}
        />
        <HelperLinks />
        <button className={styles.signInButton} onClick={handleSignIn}>
          SIGN IN
        </button>
      </div>

      <p className={styles.error}>{error || '\u00A0'}</p>

      <SignUpLink />
    </div>
  );
}

export default SignInPage;
