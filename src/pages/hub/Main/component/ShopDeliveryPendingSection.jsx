/* eslint-disable react/function-component-definition */
import React, { useEffect, useState } from 'react';
import axiosInstance from '../../../../services/axios-config';
import styles from '../MainPage.module.scss';
import Button from '../../../../common/components/Button';
import { formattedDate } from '../../../../common/utils/orderUtils';
import { CircularProgress } from '@mui/material';

const ShopDeliveryPendingSection = ({ isOrderChanged, handleOpenOrderDetailModal }) => {
  const [orders, setOrders] = useState([]);
  const [pageNo, setPageNo] = useState(1);
  const [isFullLoaded, setIsFullLoaded] = useState(false);
  const numOfRows = 3;
  const [loading, setLoading] = useState(false);
  // 완료된 주문 조회
  const fetchCompletedOrders = async () => {
    const response = await axiosInstance.get('/shop-service/shop/filtering-order', {
      params: {
        pageNo,
        numOfRows,
        orderState: 'READY_FOR_DELIVERY',
      },
    });

    if (pageNo === 1) {
      setOrders(response.data.data);
    } else {
      setOrders(prev => [...prev, ...response.data.data]);
    }

    if (response.data.data.length < numOfRows) {
      setIsFullLoaded(true);
    }
  };

  useEffect(() => {
    setLoading(true);
    console.log('fetchCompletedOrders');
    fetchCompletedOrders().then(() => {
      setLoading(false);
    });
    console.log('fetchCompletedOrders', orders);
  }, [pageNo]);

  useEffect(() => {
    if (pageNo !== 1) {
      setPageNo(1);
    } else {
      setLoading(true);
      fetchCompletedOrders().then(() => {
        setLoading(false);
      });
    }

    setIsFullLoaded(false);
  }, [isOrderChanged]);

  return (
    <main className={styles.main}>
      <div className={styles.searchBar}>
        <h2>완료된 주문</h2>
      </div>
      {loading ? (
        <CircularProgress style={{ position: 'absolute', top: '50%', left: '50%' }} />
      ) : (
        <>
          <div className={styles.orderList}>
            {orders.map(order => (
              <div key={order.orderId} className={styles.orderItem}>
                <div className={styles.orderMeta}>
                  <span>{order.orderId.toUpperCase()}</span>
                  <span>{formattedDate(order.createdAt)}</span>
                </div>
                <div className={styles.orderActions}>
                  <Button onClick={() => handleOpenOrderDetailModal(order)}>주문 상세</Button>
                </div>
              </div>
            ))}
          </div>
          {!isFullLoaded && (
            <div className={styles.allOrderPageButton}>
              <Button onClick={() => setPageNo(pageNo + 1)}>더보기 +</Button>
            </div>
          )}
        </>
      )}
    </main>
  );
};

export default ShopDeliveryPendingSection;
