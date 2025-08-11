/* eslint-disable no-nested-ternary */
/* eslint-disable react/prop-types */
/* eslint-disable react/function-component-definition */
import React from 'react';
import Button from '../../../../common/components/Button';
import { formattedDate, orderStatus } from '../../../../common/utils/orderUtils';
import styles from '../RequestListPage.module.scss';
import axiosInstance from '../../../../services/axios-config';

function RiderOrderCard({ order, fetchOrders, accepted }) {
  const handleStatusChange = async () => {
    // 상황에 따른 confirm 메시지 설정
    let confirmMessage;

    if (!accepted) {
      // 배달 가능 주문 목록에서 상태변경 버튼을 눌렀을 때
      confirmMessage = '배송 승인 하시겠습니까?';
    } else if (order.orderState === 'DELIVERING') {
      // 배송 중 상태에서 상태변경 버튼을 눌렀을 때
      confirmMessage = '배송을 완료하시겠습니까?';
    } else {
      // 수락한 요청에서 상태변경 버튼을 눌렀을 때 (배송 시작)
      confirmMessage = '배송시작하시겠습니까?';
    }

    // 확인 창 표시
    const isConfirmed = window.confirm(confirmMessage);

    // 사용자가 취소를 선택한 경우 함수 종료
    if (!isConfirmed) {
      return;
    }

    // 사용자가 확인을 선택한 경우 기존 로직 실행
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
    <div
      className={`${styles.orderItem} ${order.orderState === 'DELIVERING' ? styles.highligthOrderItem : ''}`}
    >
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
          <Button onClick={handleStatusChange}>상태 변경</Button>
        </div>
      )}
    </div>
  );
}

export default RiderOrderCard;
