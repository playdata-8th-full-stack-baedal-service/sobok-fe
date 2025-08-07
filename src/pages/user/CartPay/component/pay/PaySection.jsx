/* eslint-disable react/function-component-definition */
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styles from '../../CartPayPage.module.scss';
import PayHeading from './PayHeading';
import PayOrderer from './PayOrderer';
import {
  fetchOrdererInfo,
  fetchShopInfo,
  flipPayVisible,
  requestPayment,
  setPayClick,
} from '../../../../../store/cartPaySlice';
import Checkout from './Checkout';

const PaySection = () => {
  const dispatch = useDispatch();
  const {
    totalPrice,
    isPayVisible,
    isReady,
    orderId,
    riderRequest,
    selectedAddressId,
    selectedCartItemIds,
    orderer,
    cartIngredientStockList,
    shopInfo,
  } = useSelector(state => state.pay);

  useEffect(() => {
    dispatch(fetchOrdererInfo());
  }, [dispatch]);

  const handlePayVisible = () => {
    dispatch(flipPayVisible());
  };

  const handleStartPayment = () => {
    dispatch(
      requestPayment({
        orderId,
        totalPrice,
        riderRequest,
        userAddressId: selectedAddressId,
        cartCookIdList: selectedCartItemIds,
      })
    );
    dispatch(setPayClick(true));
  };

  useEffect(() => {
    if (orderer?.addresses == null || selectedAddressId == null) return;
    dispatch(
      fetchShopInfo({
        addressId: selectedAddressId,
        cartIngredientStockList,
      })
    );
  }, [orderer?.addresses, selectedAddressId, cartIngredientStockList, dispatch]);

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
        <footer>
          <button
            type="button"
            onClick={handleStartPayment}
            className={styles.btnPay}
            disabled={
              totalPrice === 0 ||
              !isReady ||
              !shopInfo ||
              shopInfo.length === 0 ||
              shopInfo.every(shop => !shop.satisfiable)
            }
          >
            {totalPrice.toLocaleString()} 원 결제 하기
          </button>
        </footer>
      </div>
    </div>
  );
};

export default PaySection;
