/* eslint-disable react/function-component-definition */
import React, { useEffect, useState } from 'react';
import ModalWrapper from '../../../../common/modals/ModalWrapper';
import styles from './ShopOrderDetailModal.module.scss';
import axiosInstance from '../../../../services/axios-config';
import { formattedDate, orderStatus } from '../../../../common/utils/orderUtils';

const ShopOrderDetailModal = ({ onClose, order }) => {
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
              <div className={styles.cookName}>
                {`요리 ${idx + 1} 이름`}
                <br />
                {item.cookName}
              </div>
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
        </div>
      </div>
    </ModalWrapper>
  );
};

export default ShopOrderDetailModal;
