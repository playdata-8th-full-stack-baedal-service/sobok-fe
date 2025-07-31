import React from 'react';
import { CircularProgress } from '@mui/material';
import Button from '../../../../common/components/Button';
import { formattedDate, orderStatus } from '../../../../common/utils/orderUtils';
import styles from '../MainPage.module.scss';
import CapybaraLoader from '../../LoadingBar/CapybaraLoader';

const OrderList = ({ loading, orders, isFullLoaded, onLoadMore, onOrderDetailClick }) => {
  if (loading) {
    return (
      <CapybaraLoader/>
    );
  }

  if (!orders || orders.length === 0) {
    return <p className={styles.emptyMessage}>주문이 없습니다!</p>;
  }

  return (
    <>
      <div className={styles.orderList}>
        {orders.map(order => (
          <div key={order.orderId} className={styles.orderItem}>
            <div className={styles.orderMeta}>
              <span>{order.orderId.toUpperCase()}</span>
              <span>{formattedDate(order.updatedAt)}</span>
              <span>{orderStatus[order.orderState]}</span>
            </div>
            <div className={styles.orderActions}>
              <Button onClick={() => onOrderDetailClick(order)}>주문 상세</Button>
            </div>
          </div>
        ))}
      </div>
      {!isFullLoaded && (
        <div className={styles.allOrderPageButton}>
          <Button onClick={onLoadMore}>더보기 +</Button>
        </div>
      )}
    </>
  );
};

export default OrderList;
