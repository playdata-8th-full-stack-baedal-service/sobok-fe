/* eslint-disable react/function-component-definition */
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import ModalWrapper from '../../../../common/modals/ModalWrapper';
import styles from './ShopOrderDetailModal.module.scss';
import axiosInstance from '../../../../services/axios-config';
import { formattedDate, orderStatus } from '../../../../common/utils/orderUtils';
import Button from '../../../../common/components/Button';
import { setRefreshAll, fetchPreparingOrders } from '../../../../store/hubSlice';

const ShopOrderDetailModal = ({ onClose, order }) => {
  const dispatch = useDispatch();
  const [orderDetail, setOrderDetail] = useState(null);

  useEffect(() => {
    const fetchOrderDetail = async () => {
      const response = await axiosInstance.get(
        `/payment-service/payment/detail/${order.paymentId}`
      );
      setOrderDetail(response.data.data);
    };
    fetchOrderDetail();
  }, [order]);

  const handleChangeOrderState = async () => {
    // 확인 다이얼로그 표시
    const isConfirmed = window.confirm('정말 주문 상태를 변경하시겠습니까?');
    
    // 사용자가 "아니요"를 선택한 경우 함수 종료
    if (!isConfirmed) {
      return;
    }

    try {
      const response = await axiosInstance.patch(
        `/payment-service/payment/change-orderState?id=${order.paymentId}`
      );
      dispatch(setRefreshAll(true));
      dispatch(fetchPreparingOrders({ orderState: 'PREPARING_INGREDIENTS' }));
      dispatch(fetchPreparingOrders({ orderState: 'READY_FOR_DELIVERY' }));
      onClose();
    } catch (error) {
      console.error('주문 상태 변경 실패:', error);
      // 에러 처리 로직을 추가할 수 있습니다
    }
  };

  console.log('orderDetail', orderDetail);

  return (
    <ModalWrapper title="주문 내역" onClose={onClose}>
      <div className={styles.orderDetailContainer}>
        <div className={styles.orderBox}>
          <div className={styles.header}>
            <div className={styles.info}>
              <div className={styles.orderId}>{orderDetail?.orderId.toUpperCase()}</div>
              <div className={styles.date}>{formattedDate(orderDetail?.createdAt) || ''}</div>
            </div>
            <div className={styles.status}>{orderStatus[orderDetail?.orderState]}</div>
          </div>
          {orderDetail?.items?.map((item, idx) => (
            <div key={item.cookId + idx} className={styles.menuItem}>
              <div className={styles.cookName}>{item.cookName}</div>
              <div className={styles.ingredients}>
                <strong>기본 재료</strong>
                {item.baseIngredients.map(ingre => (
                  <div key={ingre.ingredientId}>
                    - {ingre.ingreName} ({ingre.unitQuantity * ingre.unit}g)
                  </div>
                ))}
                {item.additionalIngredients.length > 0 && (
                  <>
                    <strong>추가 식재료</strong>
                    {item.additionalIngredients.map(add => (
                      <div key={add.ingredientId}>
                        - {add.ingreName} ({add.unitQuantity * add.unit}g)
                      </div>
                    ))}
                  </>
                )}
              </div>
            </div>
          ))}
          <div className={styles.contactInfo}>
            <div>사용자 주소</div>
            <div>{orderDetail?.roadFull}</div>
            <div>배달원 요청사항</div>
            <div>{orderDetail?.riderRequest}</div>
          </div>
          <div className={styles.paymentInfo}>
            <div>결제 방법</div>
            <div>{orderDetail?.payMethod}</div>
            <div>결제 금액</div>
            <div>{orderDetail?.totalPrice?.toLocaleString() || ''}원</div>
          </div>
          <div className={styles.buttonContainer}>
            {orderDetail?.orderState === 'PREPARING_INGREDIENTS' && (
              <Button className={styles.checkout} onClick={handleChangeOrderState}>
                주문 상태 변경
              </Button>
            )}
          </div>
        </div>
      </div>
    </ModalWrapper>
  );
};

export default ShopOrderDetailModal;