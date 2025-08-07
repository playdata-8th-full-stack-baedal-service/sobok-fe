/* eslint-disable react/function-component-definition */
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCartItem, flipPayVisible } from '../../../../../store/cartPaySlice';
import styles from '../../CartPayPage.module.scss';
import CartHeading from './CartHeading';
import CartList from './CartList';

const CartSection = () => {
  const dispatch = useDispatch();
  const { cartItems, isPayVisible } = useSelector(state => state.pay);

  // 카트 정보 가져오기
  useEffect(() => {
    dispatch(fetchCartItem());
  }, [dispatch]);

  const handlePayPop = () => {
    if (!isPayVisible) {
      dispatch(flipPayVisible());
    }
  };

  return (
    <div className={`${styles.cartSection} ${cartItems.length !== 0 ? styles.isPresent : ''}`}>
      {/* 장바구니 화면 제목 */}
      <CartHeading />

      {/* 장바구니 목록 */}
      <CartList />
      {!isPayVisible && (
        <button className={styles.btnPay} type="button" onClick={handlePayPop}>
          결제하기
        </button>
      )}
    </div>
  );
};
export default CartSection;
