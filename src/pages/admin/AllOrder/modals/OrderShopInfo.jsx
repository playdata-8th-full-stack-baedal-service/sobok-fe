import React from 'react';
import PropTypes from 'prop-types';
import styles from './AdminOrderDetailModal.module.scss';

function OrderShopInfo({ shopName, ownerName, shopAddress, shopPhone }) {
  return shopName && ownerName && shopAddress && shopPhone ? (
    <div className={styles.DetailBodyRow}>
      <span>가게 정보</span>
      <span>가게 지점명 : {shopName}</span>
      <span>가게 담당자 : {ownerName}</span>
      <span>가게 주소 : {shopAddress}</span>
      <span>가게 전화번호 : {shopPhone}</span>
    </div>
  ) : null;
}

OrderShopInfo.propTypes = {
  shopName: PropTypes.string.isRequired,
  ownerName: PropTypes.string.isRequired,
  shopAddress: PropTypes.string.isRequired,
  shopPhone: PropTypes.string.isRequired,
};

export default OrderShopInfo;
