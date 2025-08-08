/* eslint-disable react/function-component-definition */
import React from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { openModal } from '../../../../store/modalSlice';
import Button from '../../../../common/components/Button';
import { formattedDate } from '../../../../common/utils/orderUtils';
import styles from './OrderGrid.module.scss';

const OrderGrid = ({ orders }) => {
  const dispatch = useDispatch();

  // 주문 상세보기 클릭
  const handleOrderDetailClick = order => {
    dispatch(
      openModal({
        type: 'ADMIN_ORDER_DETAIL',
        props: {
          order,
        },
      })
    );
  };

  if (orders.length === 0) {
    return (
      <div className={styles.orderListWrapper}>
        <p className={styles.emptyMessage}>주문 내역이 없습니다.</p>
      </div>
    );
  }

  return (
    <div className={styles.orderListWrapper}>
      {orders.map((order, index) => (
        <div key={order.orderId} className={styles.orderCard}>
          <div className={styles.orderInfo}>
            <span className={styles.orderId}>{order.orderId.toUpperCase()}</span>
            <span className={styles.orderDate}>{formattedDate(order.createdAt)}</span>
          </div>
          <div className={styles.orderActions}>
            <Button onClick={() => handleOrderDetailClick(order)}>주문 상세보기</Button>
          </div>
        </div>
      ))}
    </div>
  );
};

OrderGrid.propTypes = {
  orders: PropTypes.arrayOf(
    PropTypes.shape({
      orderId: PropTypes.string.isRequired,
      createdAt: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default OrderGrid;
