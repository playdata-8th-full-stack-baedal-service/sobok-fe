/* eslint-disable react/function-component-definition */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import ModalWrapper from '../../../../common/modals/ModalWrapper';
import axiosInstance from '../../../../services/axios-config';
import styles from './MyOrderDetailPage.module.scss';

const orderStatus = {
  ORDER_PENDING: '결제 완료',
  ORDER_COMPLETE: '주문 완료',
  PREPARING_INGREDIENTS: '재료 준비중',
  READY_FOR_DELIVERY: '배송 준비중',
  DELIVERY_ASSIGNED: '배송 중',
  DELIVERING: '배송 완료',
  DELIVERY_COMPLETE: '배송 완료',
};

const MyOrderDetailPage = ({ onClose, order }) => {
  const [orderDetail, setOrderDetail] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrderDetail = async () => {
      try {
        const response = await axiosInstance.get(
          `/payment-service/payment/detail/${order.paymentId}`
        );
        setOrderDetail(response.data.data);
      } catch (error) {
        console.error('주문 상세 조회 실패:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrderDetail();
  }, [order.paymentId]);

  const formatDate = timestamp => {
    const date = new Date(timestamp);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <ModalWrapper onClose={onClose}>
        <div className={styles.loading}>로딩 중...</div>
      </ModalWrapper>
    );
  }

  return (
    <ModalWrapper onClose={onClose}>
      <div className={styles.orderDetailPage}>
        <h1 className={styles.title}>주문 상세</h1>

        {/* 주문 기본 정보 */}
        <section className={styles.section}>
          <h2>주문 정보</h2>
          <div className={styles.infoGrid}>
            <div className={styles.infoItem}>
              <span className={styles.label}>주문 번호</span>
              <span className={styles.value}>{orderDetail?.orderId?.toUpperCase()}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.label}>주문 일시</span>
              <span className={styles.value}>
                {orderDetail?.createdAt ? formatDate(orderDetail.createdAt) : '-'}
              </span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.label}>주문 상태</span>
              <span className={styles.value}>
                {orderStatus[orderDetail?.orderState] || orderDetail?.orderState}
              </span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.label}>결제 방법</span>
              <span className={styles.value}>{orderDetail?.payMethod || '-'}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.label}>결제 금액</span>
              <span className={styles.value}>{orderDetail?.totalPrice?.toLocaleString()}원</span>
            </div>
          </div>
        </section>

        {/* 배송 정보 */}
        <section className={styles.section}>
          <h2>배송 정보</h2>
          <div className={styles.infoGrid}>
            <div className={styles.infoItem}>
              <span className={styles.label}>배송 주소</span>
              <span className={styles.value}>
                {orderDetail?.roadFull} {orderDetail?.addrDetail}
              </span>
            </div>
            {orderDetail?.riderRequest && (
              <div className={styles.infoItem}>
                <span className={styles.label}>배송 요청사항</span>
                <span className={styles.value}>{orderDetail.riderRequest}</span>
              </div>
            )}
            {orderDetail?.completeTime && (
              <div className={styles.infoItem}>
                <span className={styles.label}>배송 완료 시간</span>
                <span className={styles.value}>{formatDate(orderDetail.completeTime)}</span>
              </div>
            )}
          </div>
        </section>

        {/* 매장 정보 */}
        <section className={styles.section}>
          <h2>매장 정보</h2>
          <div className={styles.infoGrid}>
            <div className={styles.infoItem}>
              <span className={styles.label}>매장명</span>
              <span className={styles.value}>{orderDetail?.shopName || '-'}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.label}>매장 주소</span>
              <span className={styles.value}>{orderDetail?.shopAddress || '-'}</span>
            </div>
          </div>
        </section>

        {/* 주문 상품 */}
        <section className={styles.section}>
          <h2>주문 상품</h2>
          <div className={styles.itemsList}>
            {orderDetail?.items?.map((item, index) => (
              <div key={index} className={styles.itemCard}>
                <img src={item.thumbnail} alt={item.cookName} className={styles.itemImage} />
                <div className={styles.itemInfo}>
                  <h3>{item.cookName}</h3>
                  <p>수량: {item.quantity}개</p>
                  <p>가격: {item.price?.toLocaleString()}원</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </ModalWrapper>
  );
};

MyOrderDetailPage.propTypes = {
  onClose: PropTypes.func.isRequired,
  order: PropTypes.shape({
    paymentId: PropTypes.number.isRequired,
    orderId: PropTypes.string.isRequired,
  }).isRequired,
};

export default MyOrderDetailPage;
