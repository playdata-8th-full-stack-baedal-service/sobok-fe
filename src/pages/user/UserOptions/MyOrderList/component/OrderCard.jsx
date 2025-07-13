/* eslint-disable react/function-component-definition */
import React from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import OrderItem from './OrderItem';
import Button from '../../../../../common/components/Button';
import styles from './OrderCard.module.scss';
import { openModal } from '../../../../../store/modalSlice';

const orderStatus = {
  ORDER_PENDING: '결제 완료',
  ORDER_COMPLETE: '주문 완료',
  PREPARING_INGREDIENTS: '재료 준비중',
  READY_FOR_DELIVERY: '배송 준비중',
  DELIVERY_ASSIGNED: '배송 중',
  DELIVERING: '배송 완료',
  DELIVERY_COMPLETE: '취소 완료',
};

const OrderCard = ({ order }) => {
  const dispatch = useDispatch();
  const orderDate = new Date(order.createdAt);
  const formattedDate = `${orderDate.getFullYear()}-${String(orderDate.getMonth() + 1).padStart(2, '0')}-${String(orderDate.getDate()).padStart(2, '0')}`;

  const handleOrderDetailClick = () => {
    dispatch(
      openModal({
        type: 'ORDER_DETAIL',
        props: {
          order,
        },
      })
    );
  };

  return (
    <div className={styles.orderCard}>
      <div className={styles.orderHeader}>
        <span>주문 번호 : {order.orderId.toUpperCase()}</span>
        <span>주문 일자 : {formattedDate}</span>
        <span>배송 상태 : {orderStatus[order.orderState]}</span>
      </div>
      <div className={styles.orderItems}>
        {order.cook.map(item => (
          <OrderItem key={`${order.orderId}-${item.cookName}`} item={item} />
        ))}
      </div>
      <div className={styles.orderFooter}>
        <span>결제 금액 : {order.totalPrice.toLocaleString()}원</span>
        <Button onClick={handleOrderDetailClick}>상세 보기</Button>
      </div>
    </div>
  );
};

OrderCard.propTypes = {
  order: PropTypes.shape({
    createdAt: PropTypes.number.isRequired,
    orderId: PropTypes.string.isRequired,
    orderState: PropTypes.string.isRequired,
    cook: PropTypes.arrayOf(
      PropTypes.shape({
        cookName: PropTypes.string.isRequired,
        thumbnail: PropTypes.string.isRequired,
      })
    ).isRequired,
    totalPrice: PropTypes.number.isRequired,
  }).isRequired,
};

export default OrderCard;
