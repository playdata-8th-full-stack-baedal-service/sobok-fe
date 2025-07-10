import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { calculateTotal } from '../../../../../store/cartSlice';
import styles from './UserCartSummary.module.scss';

function UserCartSummary() {
  const dispatch = useDispatch();
  const { totalPrice, selectedItems } = useSelector(state => state.cart);
  const navigate = useNavigate();
  // 총 금액 계산
  useEffect(() => {
    dispatch(calculateTotal(selectedItems));
  }, [selectedItems, dispatch]);

  return (
    <footer className={styles.cartFooter}>
      <span className={styles.totalPrice}>총 금액 {totalPrice.toLocaleString()} 원</span>
      <button
        type="button"
        disabled={selectedItems.length === 0}
        className={`${styles.payButton} ${selectedItems.length > 0 ? styles.active : ''}`}
        onClick={() => {
          navigate('/user/pay');
        }}
      >
        결제 하기
      </button>
    </footer>
  );
}

export default UserCartSummary;
