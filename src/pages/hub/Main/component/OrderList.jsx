/* eslint-disable react/function-component-definition */
import React from 'react';
import { CircularProgress } from '@mui/material';
import Button from '../../../../common/components/Button';
import { formattedDate } from '../../../../common/utils/orderUtils';
import styles from '../MainPage.module.scss';

const OrderList = ({ loading, orders, isFullLoaded, onLoadMore, onOrderDetailClick }) => {
  if (loading) {
    return <CircularProgress style={{ position: 'absolute', top: '50%', left: '50%' }} />;
  }

  return (
    <>
      <div className={styles.orderList}>
        {orders.map(order => (
          <div key={order.orderId} className={styles.orderItem}>
            <div className={styles.orderMeta}>
              <span>{order.orderId.toUpperCase()}</span>
              <span>{formattedDate(order.createdAt)}</span>
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
