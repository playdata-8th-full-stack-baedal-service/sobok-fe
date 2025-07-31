import React, { useEffect, useState } from 'react';
import OrderCard from './component/OrderCard';
import axiosInstance from '../../../../services/axios-config';
import Button from '../../../../common/components/Button';
import styles from './MyOrderListPage.module.scss';

function MyOrderListPage() {
  const [orders, setOrders] = useState([]);
  const [pageNo, setPageNo] = useState(1);
  const [numOfRows] = useState(10);
  const [isFullLoaded, setIsFullLoaded] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      const response = await axiosInstance.get('/payment-service/payment/get-myPayment', {
        params: {
          pageNo,
          numOfRows,
        },
      });
      setOrders(prev => [...prev, ...(response.data.data || [])]);
      if (response.data.data.length < numOfRows) {
        setIsFullLoaded(true);
      }
    };
    fetchOrders();
  }, [pageNo, numOfRows]);

  return (
    <div className={styles.myOrderPage}>
      <h2 className={styles.title}> 주문 내역</h2>
      {orders.length === 0 ? (
        <div className={styles.noOrders}>주문 내역이 없습니다.</div>
      ) : (
        <>
          {orders.map(order => (
            <OrderCard key={order.paymentId} order={order} />
          ))}

          {!isFullLoaded && (
            <div className={styles.loadMoreButton}>
              <Button onClick={() => setPageNo(pageNo + 1)}>더보기 +</Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default MyOrderListPage;
