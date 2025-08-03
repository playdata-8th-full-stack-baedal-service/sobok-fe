import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Divider } from '@mui/material';
import { openModal } from '../../../store/modalSlice';
import axiosInstance from '../../../services/axios-config';
import PrepareOrderSection from '../Main/component/PrepareOrderSection';
import ShopDeliveryPendingSection from '../Main/component/ShopDeliveryPendingSection';
// eslint-disable-next-line import/no-unresolved, import/extensions
import useToast from '@/common/hooks/useToast';
import { setError } from '../../../store/hubSlice';

function HubDashboard() {
  const dispatch = useDispatch();

  const { showNegative } = useToast();
  const { error, loading } = useSelector(state => state.hub);

  const [isOrderChanged, setIsOrderChanged] = useState(false);

  // Error Toast
  useEffect(() => {
    if (error) {
      showNegative(error);
      dispatch(setError(null));
    }
  }, [error, showNegative, dispatch]);

  // 주문 상세 모달
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
        await axiosInstance.patch(
          `/payment-service/payment/change-orderState?id=${order.paymentId}`
        );
        setIsOrderChanged(prev => !prev);
      } catch (err) {
        console.error('주문 상태 변경 실패:', err);
      }
    }
  };

  return (
    <div>
      <PrepareOrderSection />
      <Divider />
      <ShopDeliveryPendingSection />
    </div>
  );
}

export default HubDashboard;
