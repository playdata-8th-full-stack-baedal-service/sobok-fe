/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/function-component-definition */
import React, { useState, useEffect } from 'react';
import { RefreshCcw } from 'lucide-react';
import { CircularProgress } from '@mui/material';
import styles from '../MainPage.module.scss';
import Button from '../../../../common/components/Button';
import { formattedDate } from '../../../../common/utils/orderUtils';
import axiosInstance from '../../../../services/axios-config';

const ShopOrderSection = ({ handleStatusChange, handleOpenOrderDetailModal }) => {
  const [orders, setOrders] = useState([]);
  const [pageNo, setPageNo] = useState(1);
  const [loading, setLoading] = useState(false);

  const numOfRows = 3;

  const [maxCount, setMaxCount] = useState(0);
  const [isFullLoaded, setIsFullLoaded] = useState(false);

  // 대기중인 주문 조회
  const fetchPreparingOrders = async (page = pageNo, number = numOfRows) => {
    setLoading(true);

    const response = await axiosInstance.get('/shop-service/shop/filtering-order', {
      params: {
        pageNo: page,
        numOfRows: number,
        orderState: 'PREPARING_INGREDIENTS',
      },
    });

    const { data } = response.data;

    if (data.length === 0) {
      setIsFullLoaded(true);
      setMaxCount(0);
    }

    if (page === 1) {
      setOrders(data);
      setMaxCount(data.length);
    } else {
      setOrders(prev => [...prev, ...data]);
    }

    if (page === 1 && data.length < number) {
      setIsFullLoaded(true);
      setMaxCount(data.length);
    } else {
      setMaxCount(prev => prev + data.length); // 누적 방식 가능
    }

    setLoading(false);
  };

  // 새로운 주문이 있는 지 확인하는 함수
  const handlePolling = async () => {
    const response = await axiosInstance.get('/shop-service/shop/filtering-order', {
      params: {
        pageNo: 1,
        numOfRows: orders.length + numOfRows,
        orderState: 'PREPARING_INGREDIENTS',
      },
    });
    const { data } = response.data;

    // 더보기 버튼 활성화 여부 조회
    if (data.length !== orders.length) {
      setMaxCount(data.length);
      fetchPreparingOrders(1, pageNo * numOfRows);
    }
  };

  // Page 넘버 바뀔때마다 조회
  useEffect(() => {
    fetchPreparingOrders();
  }, [pageNo]);

  useEffect(() => {
    const interval = setInterval(() => {
      handlePolling();
    }, 5000);

    return () => clearInterval(interval);
  }, [pageNo, orders]);

  // useEffect(() => {
  //   if (!isFullLoaded && orders.length < pageNo * numOfRows) {
  //     fetchPreparingOrders(pageNo, 1); // 한 개만 채워넣기
  //   }
  // }, [orders]);

  const handleLoadMore = () => {
    setPageNo(prev => prev + 1);
  };

  return (
    <main className={styles.main}>
      <div className={styles.searchBar}>
        <h2>대기중인 주문</h2>
        <RefreshCcw
          onClick={() => {
            window.location.reload();
          }}
          className={styles.refreshButton}
        />
      </div>
      <div className={styles.orderList}>
        {loading && <CircularProgress style={{ position: 'absolute', top: '50%', left: '50%' }} />}
        {orders.length === 0 && !loading ? (
          <div className={styles.emptyState}>
            <p>대기중인 주문이 없습니다</p>
          </div>
        ) : (
          orders.map(order => (
            <div key={order.orderId + order.paymentId} className={styles.orderItem}>
              <div className={styles.orderMeta}>
                <span>{order.orderId.toUpperCase()}</span>
                <span>{formattedDate(order.createdAt)}</span>
              </div>
              <div className={styles.orderActions}>
                <Button onClick={() => handleOpenOrderDetailModal(order)}>주문 상세</Button>
                <Button
                  onClick={() => {
                    handleStatusChange(order);
                    setOrders(prev =>
                      prev.filter(prevOrder => prevOrder.orderId !== order.orderId)
                    );
                  }}
                >
                  상태 변경
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
      {orders.length > 0 && orders.length < maxCount && (
        <div className={styles.allOrderPageButton}>
          <Button onClick={handleLoadMore}>더보기 +</Button>
        </div>
      )}
    </main>
  );
};

export default ShopOrderSection;
