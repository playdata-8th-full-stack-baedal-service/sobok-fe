/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Divider } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import styles from './MainPage.module.scss';
import axiosInstance from '../../../services/axios-config';
import { openModal } from '../../../store/modalSlice';
import ShopOrderSection from './component/ShopOrderSection';
import ShopDeliveryPendingSection from './component/ShopDeliveryPendingSection';

// import ShopPreparePendingSection from './component/ShopDeliveryPendingSection';

// import ShopPreparePendingSection from './component/ShopPreparePendingSection';

function MainPage() {
  const dispatch = useDispatch();
  const [isOrderChanged, setIsOrderChanged] = useState(false);
  const nav = useNavigate();

  // 주문 상세 모달 열기
  const handleOpenOrderDetailModal = order => {
    dispatch(
      openModal({
        type: 'SHOP_ORDER_DETAIL',
        props: {
          order,
        },
      })
    );
  };

  // 주문 상태 변경
  const handleStatusChange = async order => {
    if (order) {
      await axiosInstance.patch(`/payment-service/payment/change-orderState?id=${order.paymentId}`);
    }
    setIsOrderChanged(prev => !prev);
  };

  return (
    <div className={styles.container}>
      <div className={styles.input}>
        <button className={styles.value}>Public profile</button>
        <button className={styles.value}>Account</button>
        <button className={styles.value}>Appearance</button>
        <button className={styles.value}>Accessibility</button>
        <button className={styles.value}>Notifications</button>
      </div>

      <div className={styles.hubMainPage}>
        <ShopOrderSection
          handleStatusChange={handleStatusChange}
          handleOpenOrderDetailModal={handleOpenOrderDetailModal}
        />
        <Divider />
        <ShopDeliveryPendingSection
          isOrderChanged={isOrderChanged}
          handleOpenOrderDetailModal={handleOpenOrderDetailModal}
        />
      </div>
    </div>
  );
}

export default MainPage;
