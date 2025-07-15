import React from 'react';
import PropTypes from 'prop-types';
import styles from './AdminOrderDetailModal.module.scss';

function OrderPaymentInfo({ payMethod, totalPrice }) {
  return (
    <div className={styles.DetailBodyRow}>
      <span>결제 정보</span>
      <span>결제 방법 : {payMethod}</span>
      <span>결제 금액 : {totalPrice}</span>
    </div>
  );
}

OrderPaymentInfo.propTypes = {
  payMethod: PropTypes.string.isRequired,
  totalPrice: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};

export default OrderPaymentInfo;
