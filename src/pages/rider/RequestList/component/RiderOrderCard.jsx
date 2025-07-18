/* eslint-disable no-nested-ternary */
/* eslint-disable react/prop-types */
/* eslint-disable react/function-component-definition */
import React from 'react';
import Button from '../../../../common/components/Button';
import { formattedDate, orderStatus } from '../../../../common/utils/orderUtils';
import styles from '../RequestListPage.module.scss';
import axiosInstance from '../../../../services/axios-config';

const RiderOrderCard = ({ order, fetchOrders, accepted }) => {
  const handleStatusChange = async () => {
    const url = accepted
      ? order.orderState === 'DELIVERING'
        ? 'complete-delivery'
        : 'change-orderState'
      : 'accept-delivery';

    const response = await axiosInstance.patch(
      `/payment-service/payment/${url}?id=${order.paymentId}`
    );
    console.log(response.data);
    fetchOrders();
  };

  return (
    <div className={styles.orderItem}>
      <div className={styles.orderInfo}>
        <h3>{order.shopName}</h3>
        <span>{order.orderId.toUpperCase()}</span>
      </div>

      <div className={styles.orderDetail}>
        <p>
          <strong>가게 주소:</strong> {order.shopRoadFull}
        </p>
        <p>
          <strong>배달 주소:</strong> {order.roadFull} {order.addrDetail}
        </p>
        <p>
          <strong>주문 상태:</strong> {orderStatus[order.orderState]}
        </p>
        {accepted || (
          <p>
            <strong>주문 시간:</strong> {formattedDate(order.updatedAt || order.completeTime)}
          </p>
        )}
      </div>

      {fetchOrders && (
        <div className={styles.acceptButton}>
          <Button onClick={() => handleStatusChange(order)}>상태 변경</Button>
        </div>
      )}
    </div>
  );
};

export default RiderOrderCard;
