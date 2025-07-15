import React from 'react';
import PropTypes from 'prop-types';
import styles from './AdminOrderDetailModal.module.scss';

function OrderRiderInfo({ riderName, riderPhone }) {
  if (!riderName) return null;
  return (
    <div className={styles.DetailBodyRow}>
      <span>라이더 정보</span>
      <span>라이더 이름 : {riderName}</span>
      <span>라이더 전화번호 : {riderPhone}</span>
    </div>
  );
}

OrderRiderInfo.propTypes = {
  riderName: PropTypes.string.isRequired,
  riderPhone: PropTypes.string.isRequired,
};

export default OrderRiderInfo;
