import React from 'react';
import Input from '../../../../common/components/Input';
import styles from './IDInput.module.scss';

function IDInput({
  id,
  setId,
  rememberMe,
  setRememberMe,
  onKeyDown,
  inputRef,
  showLabel = true,
  showRememberMe = true, // 🔹 추가: 체크박스 표시 여부
  labelText = 'ID',
  placeholder = '아이디를 입력해 주세요.',
  wrapperClassName = '',
}) {
  return (
    <div className={`${styles.idWrapper} ${wrapperClassName}`}>
      <div className={styles.inputHeader}>
        {showLabel && <label htmlFor="id">{labelText}</label>}
        {showRememberMe && (
          <label className={styles.rememberMe}>
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={() => setRememberMe(!rememberMe)}
            />
            로그인 정보 저장
          </label>
        )}
      </div>
      <Input showLabel={false}>
        <input
          id="userid"
          type="text"
          value={id}
          onChange={e => setId(e.target.value)}
          onKeyDown={onKeyDown}
          ref={inputRef}
          placeholder={placeholder}
        />
      </Input>
    </div>
  );
}

export default IDInput;
