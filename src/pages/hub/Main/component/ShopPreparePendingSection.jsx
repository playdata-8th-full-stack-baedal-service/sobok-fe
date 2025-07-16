/* eslint-disable react/function-component-definition */
import React, { useState, useEffect, useRef } from 'react';
import { RefreshCcw } from 'lucide-react';
import { CircularProgress } from '@mui/material';
import Button from '../../../../common/components/Button';
import { formattedDate } from '../../../../common/utils/orderUtils';
import axiosInstance from '../../../../services/axios-config';
import styles from '../MainPage.module.scss';

const ShopPreparePendingSection = ({ handleStatusChange, handleOpenOrderDetailModal }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const intervalRef = useRef(null);
  const pageRef = useRef(1);
  const numOfRows = 3;

  // 주문 목록 조회
  const fetchOrders = async (page = 1, append = false) => {
    try {
      if (!append) setLoading(true);

      const response = await axiosInstance.get('/shop-service/shop/filtering-order', {
        params: {
          pageNo: page,
          numOfRows,
          orderState: 'PREPARING_INGREDIENTS',
        },
      });

      const newOrders = response.data.data;

      if (append) {
        setOrders(prev => [...prev, ...newOrders]);
      } else {
        setOrders(newOrders);
      }

      setHasMore(newOrders.length === numOfRows);
    } catch (error) {
      console.error('주문 조회 실패:', error);
    } finally {
      if (!append) setLoading(false);
    }
  };

  // 현재 주문 상태 확인 (폴링용)
  const checkOrderUpdates = async () => {
    try {
      const totalPages = Math.ceil(orders.length / numOfRows) || 1;
      const response = await axiosInstance.get('/shop-service/shop/filtering-order', {
        params: {
          pageNo: 1,
          numOfRows: totalPages * numOfRows,
          orderState: 'PREPARING_INGREDIENTS',
        },
      });

      const currentOrders = response.data.data;

      // 기존 주문과 비교해서 변경사항이 있으면 업데이트
      const ordersChanged =
        orders.length !== currentOrders.length ||
        orders.some(
          (order, index) => !currentOrders[index] || order.orderId !== currentOrders[index].orderId
        );

      if (ordersChanged) {
        setOrders(currentOrders);
        setHasMore(currentOrders.length === totalPages * numOfRows);
      }
    } catch (error) {
      console.error('주문 상태 확인 실패:', error);
    }
  };

  // 폴링 시작
  const startPolling = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      if (orders.length > 0) {
        checkOrderUpdates();
      }
    }, 3000); // 3초마다 체크
  };

  // 폴링 중지
  const stopPolling = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  // 새로고침
  const handleRefresh = () => {
    pageRef.current = 1;
    stopPolling();
    fetchOrders(1).then(() => startPolling());
  };

  // 더보기
  const handleLoadMore = () => {
    const nextPage = pageRef.current + 1;
    pageRef.current = nextPage;
    fetchOrders(nextPage, true);
  };

  // 상태 변경
  const handleOrderStatusChange = async order => {
    // const orderElement = document.querySelector(`[data-order-id="${order.orderId}"]`);
    // orderElement.style.opacity = '0.5';

    try {
      await handleStatusChange(order);
      // 성공하면 즉시 제거
      setOrders(prev => prev.filter(o => o.orderId !== order.orderId));
    } catch (error) {
      // 실패하면 원복
      alert('상태 변경에 실패했습니다.');
    }
  };

  // 컴포넌트 마운트 시 초기 로드
  useEffect(() => {
    fetchOrders(1);
    startPolling();

    return () => stopPolling();
  }, []);

  return (
    <main className={styles.main}>
      <div className={styles.searchBar}>
        <h2>대기중인 주문</h2>
        <RefreshCcw onClick={handleRefresh} className={styles.refreshButton} />
      </div>

      <div className={styles.orderList}>
        {loading && <CircularProgress style={{ position: 'absolute', top: '50%', left: '50%' }} />}
        {orders.length === 0 && !loading ? (
          <div className={styles.emptyState}>
            <p>대기중인 주문이 없습니다</p>
          </div>
        ) : (
          orders.map(order => (
            <div key={order.orderId} className={styles.orderItem}>
              <div className={styles.orderMeta}>
                <span>{order.orderId.toUpperCase()}</span>
                <span>{formattedDate(order.createdAt)}</span>
              </div>

              <div className={styles.orderActions}>
                <Button onClick={() => handleOpenOrderDetailModal(order)}>주문 상세</Button>
                <Button onClick={() => handleOrderStatusChange(order)}>상태 변경</Button>
              </div>
            </div>
          ))
        )}
      </div>

      {hasMore && !loading && orders.length > 0 && (
        <div className={styles.allOrderPageButton}>
          <Button onClick={handleLoadMore}>더보기 +</Button>
        </div>
      )}
    </main>
  );
};

export default ShopPreparePendingSection;
