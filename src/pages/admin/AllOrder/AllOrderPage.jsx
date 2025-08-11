import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import Button from '../../../common/components/Button';
import axiosInstance from '../../../services/axios-config';
import OrderGrid from './component/OrderGrid';
import styles from './AllOrderPage.module.scss';

function AllOrderPage() {
  const [orders, setOrders] = useState([]);
  const [pageNo, setPageNo] = useState(0);
  const [numOfRows] = useState(10);
  const [isFullLoaded, setIsFullLoaded] = useState(false);

  // 주문 내역 조회
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axiosInstance.get('/payment-service/payment/all', {
          params: {
            page: pageNo,
            size: numOfRows,
          },
        });
        setOrders(prev => [...prev, ...response.data.data]);
        if (response.data.data !== null && response.data.data.length < numOfRows) {
          setIsFullLoaded(true);
        }
      } catch (error) {
        console.error('주문 내역 조회 중 오류 발생:', error);
        setOrders([]);
      }
    };
    fetchOrders();
  }, [pageNo, numOfRows]);

  return (
    <div className={styles.allOrderPage}>
      <h1 className={styles.allOrderPageTitle}>주문 내역</h1>
      <OrderGrid orders={orders} />
      {!isFullLoaded && orders.length > 0 && (
        <div className={styles.allOrderPageButton}>
          <Button onClick={() => setPageNo(pageNo + 1)}>더보기 +</Button>
        </div>
      )}
    </div>
  );
}

export default AllOrderPage;
