/* eslint-disable react/function-component-definition */
import React from 'react';
import styles from '../../CartPayPage.module.scss';

const PayHeading = () => {
  return (
    <div className={`${styles.cartHeading} ${styles.heading}`}>
      <h2>결제하기</h2>
    </div>
  );
};

export default PayHeading;
