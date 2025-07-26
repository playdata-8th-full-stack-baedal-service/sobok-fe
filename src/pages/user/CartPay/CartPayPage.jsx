/* eslint-disable react/function-component-definition */
import React, { useEffect } from 'react';
import CartSection from './component/cart/CartSection';
import PaySection from './component/pay/PaySection';
import { useDispatch, useSelector } from 'react-redux';
import useToast from '@/common/hooks/useToast';
import { resetError } from '../../../store/cartPaySlice';
import Page from '../../../common/components/Page';
import styles from './CartPayPage.module.scss';

const CartPayPage = () => {
  const dispatch = useDispatch();
  const { error } = useSelector(state => state.pay);
  const { showNegative } = useToast();

  // Error 발생 시 공통 토스트 메시지 발행
  useEffect(() => {
    if (error !== null) {
      showNegative(error);
      dispatch(resetError);
    }
  }, [error, showNegative, dispatch]);

  return (
    <Page>
      <div className={styles.pageWrapper} style={{ display: 'flex' }}>
        <CartSection />
        <PaySection />
      </div>
    </Page>
  );
};

export default CartPayPage;
