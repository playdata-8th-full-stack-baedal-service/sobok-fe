import React from 'react';
import { useSelector } from 'react-redux';
import UserCartItem from './UserCartItem';
import styles from './UserCartList.module.scss';

function UserCartList() {
  const { cartItems, selectedItems } = useSelector(state => state.cart);

  return (
    <>
      <div className={styles.cartHeader}>
        <h2 className={styles.title}>장바구니</h2>
        <span className={styles.count}>
          ({selectedItems.length} / {cartItems.length})
        </span>
      </div>

      <ul className="cart-list">
        {cartItems.length > 0 ? (
          cartItems.map(item => <UserCartItem key={item.id} item={item} />)
        ) : (
          <li>카트가 비었습니다.</li>
        )}
      </ul>
    </>
  );
}

export default UserCartList;
