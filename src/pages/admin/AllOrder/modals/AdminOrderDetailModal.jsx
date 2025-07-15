/* eslint-disable import/no-unresolved */
/* eslint-disable import/extensions */
/* eslint-disable react/no-array-index-key */
/* eslint-disable react/function-component-definition */
import React from 'react';
import PropTypes from 'prop-types';
import ModalWrapper from '@/common/modals/ModalWrapper';
import { formattedDate, orderStatus } from '@/common/utils/orderUtils';
import styles from './AdminOrderDetailModal.module.scss';
import OrderUserInfo from './OrderUserInfo';
import OrderPaymentInfo from './OrderPaymentInfo';
import OrderShopInfo from './OrderShopInfo';
import OrderRiderInfo from './OrderRiderInfo';
import OrderCookList from './OrderCookList';
import OrderHeaderInfo from './OrderHeaderInfo';

const AdminOrderDetailModal = ({ onClose, order }) => {
  return (
    <ModalWrapper title="주문 내역" onClose={onClose} size="lg">
      <div>
        <OrderHeaderInfo
          orderId={order.orderId}
          createdAt={order.createdAt}
          orderState={order.orderState}
        />
        <div className={styles.orderDetailBody}>
          <OrderUserInfo {...order} />
          <OrderPaymentInfo {...order} />
          <OrderShopInfo {...order} />
          <OrderRiderInfo {...order} />
          <OrderCookList cooks={order.cooks} />
        </div>
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
