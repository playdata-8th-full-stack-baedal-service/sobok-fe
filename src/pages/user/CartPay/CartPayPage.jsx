/* eslint-disable react/function-component-definition */
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import CartSection from './component/cart/CartSection';
import PaySection from './component/pay/PaySection';
import useToast from '@/common/hooks/useToast';
import { flipPayVisible, resetError } from '../../../store/cartPaySlice';
import Page from '../../../common/components/Page';
import styles from './CartPayPage.module.scss';

  /**
   *   CartPayPage:   cart   pay   page
   *
   *   1. cart   (CartSection)
   *   2. pay   (PaySection)
   *
   *   1. cart   error   toast
   *   2. cart   item    pay   section   active/inactive
   *   3. pay   section   click   cart   section   active/inactive
   */
const CartPayPage = () => {
  const dispatch = useDispatch();
  const { error, cartItems, isPayVisible } = useSelector(state => state.pay);
  const { showNegative } = useToast();

  // Error 발생 시 공통 토스트 메시지 발행
  useEffect(() => {
    if (error !== null) {
      showNegative(error);
      dispatch(resetError());
    }
  }, [error, showNegative, dispatch]);

  return (
    <Page>
      <div className={styles.pageWrapper}>
        {isPayVisible && (
          <div className={styles.clickMasking} onClick={() => dispatch(flipPayVisible())} />
        )}
        <CartSection />
        {cartItems.length !== 0 ? <PaySection /> : <div />}
      </div>
    </Page>
  );
};

export default CartPayPage;
