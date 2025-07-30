import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Divider } from '@mui/material';
import { openModal } from '../../../store/modalSlice';
import axiosInstance from '../../../services/axios-config';
import ShopOrderSection from '../Main/component/ShopOrderSection';
import ShopDeliveryPendingSection from '../Main/component/ShopDeliveryPendingSection';

function HubDashboard() {
  const dispatch = useDispatch();
  const [isOrderChanged, setIsOrderChanged] = useState(false);

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
    <div>
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
  );
}

export default HubDashboard;