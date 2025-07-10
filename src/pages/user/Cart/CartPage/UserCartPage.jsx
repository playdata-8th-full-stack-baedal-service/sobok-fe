import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import styles from './UserCartPage.module.scss';
import UserCartList from './component/UserCartList';
import UserCartSummary from './component/UserCartSummary';
import { fetchCartItem } from '../../../../store/cartSlice';

function UserCartPage() {
  const dispatch = useDispatch();

  // 카트 정보 가져오기
  useEffect(() => {
    dispatch(fetchCartItem());
  }, [dispatch]);

  return (
    <div className={styles.userCartPage}>
      <UserCartList />
      <UserCartSummary />
    </div>
  );
}

export default UserCartPage;
