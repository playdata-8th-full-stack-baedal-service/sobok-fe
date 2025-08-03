/* eslint-disable react/prop-types */
/* eslint-disable react/function-component-definition */
import React from 'react';
import RiderOrderCard from './RiderOrderCard';
import styles from '../RequestListPage.module.scss';

const RiderOrderGrid = ({ orders, fetchOrders, accepted }) => {
  return (
    <div className={styles.orderList}>
      {orders
        .sort((a, b) => (a.orderState === 'DELIVERING' ? -1 : 1))
        .map(order => (
          <RiderOrderCard
            key={order.orderId}
            order={order}
            fetchOrders={fetchOrders}
            accepted={accepted}
          />
        ))}
    </div>
  );
};

export default RiderOrderGrid;
