import React from 'react';
import styles from '../SignInPage.module.scss';

function IDInput({ id, setId, rememberMe, setRememberMe, onKeyDown, inputRef }) {
  return (
    <>
      <div className={styles.inputHeader}>
        <label htmlFor="id">ID</label>
        <label className={styles.rememberMe}>
          <input type="checkbox" checked={rememberMe} onChange={() => setRememberMe(!rememberMe)} />
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
          onKeyDown={onKeyDown}
          ref={inputRef}
        />
      </div>
    </>
  );
}

export default IDInput;
