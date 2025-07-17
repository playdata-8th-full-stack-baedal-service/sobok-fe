/* eslint-disable react/function-component-definition */
import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import axiosInstance from '../../../services/axios-config';
import styles from '../Main/MainPage.module.scss';
import OrderList from '../Main/component/OrderList';
import { openModal } from '../../../store/modalSlice';

const HubHistoryPage = () => {
  const [orders, setOrders] = useState([]);

  const [pageNo, setPageNo] = useState(1);
  const numOfRows = 10;

  const [loading, setLoading] = useState(false);
  const [isFullLoaded, setIsFullLoaded] = useState(false);

  const dispatch = useDispatch();

  // 완료된 주문 조회
  const fetchCompletedOrders = useCallback(async () => {
    const response = await axiosInstance.get('/shop-service/shop/all-order', {
      params: {
        pageNo,
        numOfRows,
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

  useEffect(() => {
    setLoading(true);
    fetchCompletedOrders().then(() => {
      setLoading(false);
    });
  }, [pageNo]);

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

export default HubHistoryPage;
