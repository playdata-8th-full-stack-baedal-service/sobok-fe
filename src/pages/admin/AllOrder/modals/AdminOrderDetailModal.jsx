/* eslint-disable import/no-unresolved */
/* eslint-disable import/extensions */
/* eslint-disable react/no-array-index-key */
/* eslint-disable react/function-component-definition */
import React from 'react';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import ModalWrapper from '@/common/modals/ModalWrapper';
import styles from './AdminOrderDetailModal.module.scss';
import OrderUserInfo from './OrderUserInfo';
import OrderPaymentInfo from './OrderPaymentInfo';
import OrderShopInfo from './OrderShopInfo';
import OrderRiderInfo from './OrderRiderInfo';
import OrderCookList from './OrderCookList';
import OrderHeaderInfo from './OrderHeaderInfo';
import axiosInstance from '../../../../services/axios-config';

const AdminOrderDetailModal = ({ onClose, order }) => {
  const [orderDetail, setOrderDetail] = useState({});

  useEffect(() => {
    const fetchOrderDetail = async () => {
      const response = await axiosInstance.get(`/payment-service/payment/all/${order.paymentId}`);
      console.log(response.data.data);
      setOrderDetail(response.data.data);
    };
    fetchOrderDetail();
  }, []);

  return (
    <ModalWrapper title="주문 내역" onClose={onClose} size="big">
      <div className={styles.adminOrderDetailModal}>
        <OrderHeaderInfo
          orderId={order.orderId}
          createdAt={order.createdAt}
          orderState={orderDetail.orderState}
        />
        {orderDetail && (
          <div className={styles.orderDetailBody}>
            <OrderUserInfo {...orderDetail} />
            <OrderPaymentInfo {...orderDetail} />
            <OrderShopInfo {...orderDetail} />
            <OrderRiderInfo {...orderDetail} />
            <OrderCookList cooks={orderDetail.cooks} />
          </div>
        )}
      </div>
    </ModalWrapper>
  );
};

AdminOrderDetailModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  order: PropTypes.shape({
    orderId: PropTypes.string.isRequired,
    createdAt: PropTypes.string.isRequired,
    orderState: PropTypes.string.isRequired,
    loginId: PropTypes.string,
    nickname: PropTypes.string,
    phone: PropTypes.string,
    roadFull: PropTypes.string,
    address: PropTypes.string,
    payMethod: PropTypes.string,
    totalPrice: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    shopName: PropTypes.string,
    ownerName: PropTypes.string,
    shopAddress: PropTypes.string,
    shopPhone: PropTypes.string,
    riderName: PropTypes.string,
    riderPhone: PropTypes.string,
    cooks: PropTypes.arrayOf(
      PropTypes.shape({
        cookName: PropTypes.string,
        baseIngredients: PropTypes.arrayOf(PropTypes.string),
        additionalIngredients: PropTypes.arrayOf(PropTypes.string),
      })
    ),
  }).isRequired,
};

export default AdminOrderDetailModal;
