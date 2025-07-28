/* eslint-disable react/function-component-definition */
import React from 'react';
import { useSelector } from 'react-redux';
import styles from '../../CartPayPage.module.scss';
import CartItem from './CartItem';
import CartAllSelect from './CartAllSelect';

const CartList = () => {
  const { cartItems } = useSelector(state => state.pay);

  return (
    <>
      {cartItems.length !== 0 ? (
        <>
          <CartAllSelect />
          <hr className={styles.hr} />
        </>
      ) : (
        <div />
      )}
      <ul className={styles.cartItemList}>
        {cartItems.length > 0 ? (
          <div>
            {cartItems.map(item => (
              <CartItem key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <li>카트가 비었습니다.</li>
        )}
      </ul>
    </>
  );
};

export default CartList;
