/* eslint-disable react/function-component-definition */
import React from 'react';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import Button from '../../../../common/components/Button';
import { formattedDate, orderStatus } from '../../../../common/utils/orderUtils';
import styles from '../MainPage.module.scss';
import CapybaraLoader from '../../LoadingBar/CapybaraLoader';
import { openModal } from '../../../../store/modalSlice';

const OrderList = ({ orders, loading }) => {
  const dispatch = useDispatch();

  const handleOrderDetailClick = order => {
    dispatch(
      openModal({
        type: 'SHOP_ORDER_DETAIL',
        props: {
          order,
        },
      })
    );
  };

  // 로딩 상태
  if (loading) {
    return <CapybaraLoader />;
  }

  // 주문이 없을 경우
  if (orders === null || orders.length === 0) {
    return <p className={styles.emptyMessage}>주문이 없습니다!</p>;
  }

  return (
    <div className={styles.orderList}>
      {orders.map(order => (
        <div key={order.orderId} className={styles.orderItem}>
          <div className={styles.orderMeta}>
            <span>{order.orderId.toUpperCase()}</span>
            <span>{formattedDate(order.updatedAt)}</span>
            <span>{orderStatus[order.orderState]}</span>
          </div>
          <div className={styles.orderActions}>
            <Button onClick={() => handleOrderDetailClick(order)}>주문 상세</Button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default OrderList;
