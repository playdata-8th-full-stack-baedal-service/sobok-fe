import React from 'react';
import PropTypes from 'prop-types';
import styles from './AdminOrderDetailModal.module.scss';

function OrderUserInfo({ loginId, nickname, phone, roadFull, address }) {
  return (
    <div className={styles.DetailBodyRow}>
      <span>주문자 정보</span>
      <span>아이디 : {loginId ?? ''}</span>
      <span>닉네임 : {nickname ?? ''}</span>
      <span>전화번호 : {phone ?? ''}</span>
      <span>
        주소 : {roadFull ?? ''} {address ?? ''}
      </span>
    </div>
  );
}

OrderUserInfo.propTypes = {
  loginId: PropTypes.string.isRequired,
  nickname: PropTypes.string.isRequired,
  phone: PropTypes.string.isRequired,
  roadFull: PropTypes.string.isRequired,
  address: PropTypes.string.isRequired,
};

export default OrderUserInfo;
