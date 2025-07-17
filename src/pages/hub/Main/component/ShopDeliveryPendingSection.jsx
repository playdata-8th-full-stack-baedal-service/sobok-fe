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
  }, [pageNo, numOfRows]);

  useEffect(() => {
    setLoading(true);
    fetchCompletedOrders().then(() => {
      setLoading(false);
    });
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

  const handleLoadMore = () => {
    setPageNo(pageNo + 1);
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
