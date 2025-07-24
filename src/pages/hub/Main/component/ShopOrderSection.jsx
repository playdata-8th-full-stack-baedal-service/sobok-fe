// ✅ ShopOrderSection.jsx 수정본
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
  const [maxCount, setMaxCount] = useState(0);
  const [isFullLoaded, setIsFullLoaded] = useState(false);
  const numOfRows = 3;

  const fetchPreparingOrders = async (page = pageNo, number = numOfRows) => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/shop-service/shop/filtering-order', {
        params: {
          pageNo: page,
          numOfRows: number,
          orderState: 'PREPARING_INGREDIENTS',
        },
      });

      const data = response?.data?.data || [];

      if (page === 1) {
        setOrders(data);
        setMaxCount(data.length);
      } else {
        setOrders(prev => [...prev, ...data]);
      }

      if (data.length < number) {
        setIsFullLoaded(true);
      }
    } catch (err) {
      console.error('주문 조회 실패:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePolling = async () => {
    try {
      const response = await axiosInstance.get('/shop-service/shop/filtering-order', {
        params: {
          pageNo: 1,
          numOfRows: orders.length + numOfRows,
          orderState: 'PREPARING_INGREDIENTS',
        },
      });

      const data = response?.data?.data || [];

      if (data.length !== orders.length) {
        setMaxCount(data.length);
        handleStatusChange(null);
        fetchPreparingOrders(1, pageNo * numOfRows);
        setIsFullLoaded(false);
      }
    } catch (err) {
      console.error('폴링 실패:', err);
    }
  };

  useEffect(() => {
    fetchPreparingOrders();
  }, [pageNo]);

  useEffect(() => {
    const interval = setInterval(() => {
      handlePolling();
    }, 5000);

    return () => clearInterval(interval);
  }, [pageNo, orders]);

  const handleRefreshClick = () => {
    setPageNo(1);
    setMaxCount(numOfRows);
    fetchPreparingOrders(1, numOfRows);
  };

  const handleLoadMore = () => {
    setPageNo(prev => prev + 1);
  };

  return (
    <main className={styles.main}>
      <div className={styles.searchBar}>
        <h2>대기중인 주문</h2>
        <RefreshCcw onClick={handleRefreshClick} className={styles.refreshButton} />
      </div>
      <div className={styles.orderList}>
        {loading ? (
          <CircularProgress style={{ position: 'absolute', top: '50%', left: '50%' }} />
        ) : orders.length === 0 ? (
          <div className={styles.emptyState}>
            <p>주문이 없습니다!</p>
          </div>
        ) : (
          orders.map(order => (
            <div key={order.orderId + order.paymentId} className={styles.orderItem}>
              <div className={styles.orderMeta}>
                <span>{order.orderId.toUpperCase()}</span>
                <span>{formattedDate(order.updatedAt)}</span>
              </div>
              <div className={styles.orderActions}>
                <Button onClick={() => handleOpenOrderDetailModal(order)}>주문 상세</Button>
                <Button
                  onClick={() => {
                    handleStatusChange(order);
                    setOrders(prev =>
                      prev.filter(prevOrder => prevOrder.orderId !== order.orderId)
                    );
                    setTimeout(() => handleRefreshClick(), 100);
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
