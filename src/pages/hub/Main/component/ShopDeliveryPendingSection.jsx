/* eslint-disable react/function-component-definition */
import React, { useEffect, useState, useCallback } from 'react';
import axiosInstance from '../../../../services/axios-config';
import styles from '../MainPage.module.scss';
import OrderList from './OrderList';

const ShopDeliveryPendingSection = ({ isOrderChanged, handleOpenOrderDetailModal }) => {
  const [orders, setOrders] = useState([]);
  const [pageNo, setPageNo] = useState(1);
  const [isFullLoaded, setIsFullLoaded] = useState(false);
  const numOfRows = 3;
  const [loading, setLoading] = useState(false);

  // 완료된 주문 조회
  const fetchCompletedOrders = useCallback(async () => {
    try {
      const response = await axiosInstance.get('/shop-service/shop/filtering-order', {
        params: {
          pageNo,
          numOfRows,
          orderState: 'READY_FOR_DELIVERY',
        },
      });

      const data = response?.data?.data ?? []; // null이면 빈 배열로 처리

      if (pageNo === 1) {
        setOrders(data);
      } else {
        setOrders(prev => [...prev, ...data]);
      }

      if (data.length < numOfRows) {
        setIsFullLoaded(true);
      }
    } catch (error) {
      console.error('주문 조회 중 에러 발생:', error);
      setOrders([]); // 에러 시도 빈 배열로 초기화
      setIsFullLoaded(true); // 더 이상 로딩하지 않도록 처리
    }
  }, [pageNo, numOfRows]);

  useEffect(() => {
    setLoading(true);
    fetchCompletedOrders().finally(() => {
      setLoading(false);
    });
  }, [pageNo, fetchCompletedOrders]);

  useEffect(() => {
    setIsFullLoaded(false);
    if (pageNo !== 1) {
      setPageNo(1);
    } else {
      setLoading(true);
      fetchCompletedOrders().finally(() => {
        setLoading(false);
      });
    }
  }, [isOrderChanged, fetchCompletedOrders, pageNo]);

  const handleLoadMore = () => {
    setPageNo(prev => prev + 1);
  };

  return (
    <main className={styles.main}>
      <div className={styles.searchBar}>
        <h2>완료된 주문</h2>
      </div>
      <OrderList
        loading={loading}
        orders={orders}
        isFullLoaded={isFullLoaded}
        onLoadMore={handleLoadMore}
        onOrderDetailClick={handleOpenOrderDetailModal}
      />
    </main>
  );
};

export default ShopDeliveryPendingSection;
