/* eslint-disable react-hooks/exhaustive-deps */
import { RefreshCcw } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import Button from '../../../common/components/Button';
import { formattedDate } from '../../../common/utils/orderUtils';
import styles from './MainPage.module.scss';
import axiosInstance from '../../../services/axios-config';
import { openModal } from '../../../store/modalSlice';

function MainPage() {
  const [orders, setOrders] = useState([]);
  const [isFullLoaded, setIsFullLoaded] = useState(false);
  const [pageNo, setPageNo] = useState(1);
  const numOfRows = 10;

  const dispatch = useDispatch();

  const handleOpenOrderDetailModal = order => {
    dispatch(
      openModal({
        type: 'ORDER_DETAIL',
        props: {
          order,
        },
      })
    );
  };

  const handleStatusChange = order => {
    console.log(order);
  };

  const handleRefresh = () => {
    console.log('refresh');
  };

  const fetchPreparingOrders = async () => {
    const response = await axiosInstance.get('/shop-service/shop/filtering-order', {
      params: {
        pageNo,
        numOfRows,
        orderState: 'PREPARING_INGREDIENTS',
      },
    });
    console.log(response.data.data);
    setOrders(response.data.data);
    if (response.data.data.length < numOfRows) {
      setIsFullLoaded(true);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      fetchPreparingOrders();
    }, 5000);

    return () => clearInterval(interval);
  }, [pageNo, numOfRows]);

  return (
    <div className={styles.hubMainPage}>
      <main className={styles.main}>
        <div className={styles.searchBar}>
          <h2>대기중인 주문</h2>
          <RefreshCcw onClick={handleRefresh} className={styles.refreshButton} />
        </div>

        <div className={styles.orderList}>
          {orders.map(order => (
            <div key={order.orderId} className={styles.orderItem}>
              <div className={styles.orderMeta}>
                <span>{order.orderId.toUpperCase()}</span>
                <span>{formattedDate(order.createdAt)}</span>
              </div>
              <div className={styles.orderActions}>
                <Button onClick={() => handleOpenOrderDetailModal(order)}>주문 상세</Button>
                <Button onClick={handleStatusChange}>상태 변경</Button>
              </div>
            </div>
          ))}
        </div>
        {!isFullLoaded && (
          <div className={styles.allOrderPageButton}>
            <Button onClick={() => setPageNo(pageNo + 1)}>더보기 +</Button>
          </div>
        )}
      </main>
    </div>
  );
}

export default MainPage;
