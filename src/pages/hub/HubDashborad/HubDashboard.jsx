import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Divider } from '@mui/material';
import { openModal } from '../../../store/modalSlice';
import axiosInstance from '../../../services/axios-config';
import ShopOrderSection from '../Main/component/ShopOrderSection';
import ShopDeliveryPendingSection from '../Main/component/ShopDeliveryPendingSection';
import AnimatedText from '../MainText/AnimatedText';


function HubDashboard() {
  const dispatch = useDispatch();
  const [isOrderChanged, setIsOrderChanged] = useState(false);

  const handleOpenOrderDetailModal = order => {
    dispatch(
      openModal({
        type: 'SHOP_ORDER_DETAIL',
        props: { order },
      })
    );
  };

  const handleStatusChange = async order => {
    if (order) {
      try {
        await axiosInstance.patch(`/payment-service/payment/change-orderState?id=${order.paymentId}`);
        setIsOrderChanged(prev => !prev);
      } catch (err) {
        console.error('주문 상태 변경 실패:', err);
      }
    }
  };

  return (
    <div>
      <AnimatedText/>
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
