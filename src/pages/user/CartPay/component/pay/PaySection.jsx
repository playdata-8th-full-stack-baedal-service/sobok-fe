/* eslint-disable react/function-component-definition */
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styles from '../../CartPayPage.module.scss';
import PayHeading from './PayHeading';
import PayOrderer from './PayOrderer';
import { fetchOrdererInfo, flipPayVisible } from '../../../../../store/cartPaySlice';
import Checkout from './Checkout';

const PaySection = () => {
  const dispatch = useDispatch();
  const { isPayVisible } = useSelector(state => state.pay);

  useEffect(() => {
    dispatch(fetchOrdererInfo());
  }, [dispatch]);

  const handlePayVisible = () => {
    dispatch(flipPayVisible());
  };

  return (
    <div className={isPayVisible ? styles.paySection : styles.paySectionDisabled}>
      <button type="button" className={styles.foldButton} onClick={handlePayVisible}>
        {!isPayVisible ? '◀' : '▶'}
      </button>
      <div className={styles.payContent}>
        <PayHeading />

        {/* 주문자 정보 */}
        <PayOrderer />

        {/* 결제 수단 */}
        <Checkout />
        {/* 결제 버튼 */}
        {/* <footer>
          <span>총 금액 {totalPrice.toLocaleString()} 원</span>
          <button type="button" onClick={() => {}}>
            결제 하기
          </button>
        </footer> */}
      </div>
    </div>
  );
};

export default PaySection;
