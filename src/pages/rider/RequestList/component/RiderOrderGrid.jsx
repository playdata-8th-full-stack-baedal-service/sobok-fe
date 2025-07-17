/* eslint-disable react/prop-types */
/* eslint-disable react/function-component-definition */
import React from 'react';
import RiderOrderCard from './RiderOrderCard';
import styles from '../RequestListPage.module.scss';

const RiderOrderGrid = ({ orders, fetchOrders }) => {
  return (
    <div className={styles.orderList}>
      {orders.map(order => (
        <RiderOrderCard key={order.orderId} order={order} fetchOrders={fetchOrders} />
      ))}
    </div>
  );
};

export default RiderOrderGrid;
