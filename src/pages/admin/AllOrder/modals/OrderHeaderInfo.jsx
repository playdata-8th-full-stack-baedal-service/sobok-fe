/* eslint-disable import/no-unresolved */
/* eslint-disable import/extensions */
import React from 'react';
import PropTypes from 'prop-types';
import styles from './AdminOrderDetailModal.module.scss';
import { formattedDate, orderStatus } from '@/common/utils/orderUtils';

function OrderHeaderInfo({ orderId, createdAt, orderState }) {
  return (
    <div className={styles.orderDetailHeader}>
      <div className={styles.orderMeta}>
        <span className={styles.orderId}>{orderId.toUpperCase()}</span>
        <span className={styles.orderDate}>{formattedDate(createdAt)}</span>
      </div>
      <span className={`${styles.orderState} ${styles[orderState]}`}>
        {orderStatus[orderState]}
      </span>
    </div>
  );
}

OrderHeaderInfo.propTypes = {
  orderId: PropTypes.string.isRequired,
  createdAt: PropTypes.string.isRequired,
  orderState: PropTypes.string.isRequired,
};

export default OrderHeaderInfo;
