import React from 'react';
import { useDispatch } from 'react-redux';
import { openModal } from '../../../../store/modalSlice';
import styles from './HelperLinks.module.scss';

function HelperLinks() {
  const dispatch = useDispatch();

  return (
    <div className={styles.helperLinks}>
      <button onClick={() => dispatch(openModal('FIND_ID'))}>아이디 찾기</button>
      <span>/</span>
      <button onClick={() => dispatch(openModal('FIND_PW'))}>비밀번호 찾기</button>
    </div>
  );
}

export default HelperLinks;
