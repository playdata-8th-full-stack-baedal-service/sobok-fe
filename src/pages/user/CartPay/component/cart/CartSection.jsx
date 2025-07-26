/* eslint-disable react/function-component-definition */
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCartItem } from '../../../../../store/cartPaySlice';
import CartItem from './CartItem';
import styles from '../../CartPayPage.module.scss';

const CartSection = () => {
  const dispatch = useDispatch();

  const { cartItems, selectedCartItemIds } = useSelector(state => state.pay);

  // 카트 정보 가져오기
  useEffect(() => {
    dispatch(fetchCartItem());
  }, [dispatch]);

  return (
    <div className={styles.cartSection}>
      {/* 장바구니 화면 제목 */}
      <div>
        <h2>장바구니</h2>
        <span>
          ({selectedCartItemIds.length} / {cartItems.length})
        </span>
      </div>

      {/* 장바구니 목록 */}
      <ul>
        {cartItems.length > 0 ? (
          cartItems.map(item => <CartItem key={item.id} item={item} />)
        ) : (
          <li>카트가 비었습니다.</li>
        )}
      </ul>
    </div>
  );
};
export default CartSection;
