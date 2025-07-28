/* eslint-disable react/function-component-definition */
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styles from '../../CartPayPage.module.scss';
import { flipPayVisible } from '../../../../../store/cartPaySlice';

const CartHeading = () => {
  const { isPayVisible } = useSelector(state => state.pay);
  const dispatch = useDispatch();
  const handlePayPop = () => {
    if (!isPayVisible) {
      dispatch(flipPayVisible());
    }
  };
  return (
    <div className={`${styles.cartHeading} ${styles.heading}`}>
      <h2>장바구니</h2>
      <button type="button" onClick={handlePayPop}>
        결제하기
      </button>
    </div>
  );
};

export default CartHeading;
