import React, { useEffect, useState } from 'react';
import { CircularProgress } from '@mui/material';
import axiosInstance from '../../../services/axios-config';
import RiderOrderGrid from '../RequestList/component/RiderOrderGrid';
import Button from '../../../common/components/Button';
import styles from './AcceptedListPage.module.scss';

function AcceptedListPage() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEnd, setIsEnd] = useState(false);
  const [pageNo, setPageNo] = useState(1);
  const [numOfRows] = useState(10);
  const [refresh, setRefresh] = useState(true);

  useEffect(() => {
    if (!refresh) return;
    const fetchOrders = async () => {
      const response = await axiosInstance.get(
        `/delivery-service/delivery/delivering-order?pageNo=${pageNo}&numOfRows=${numOfRows}`
      );
      console.log(response.data);

      if (pageNo === 1) {
        setOrders(response.data.data);
      } else {
        setOrders(prev => [...prev, ...response.data.data]);
      }
      if (response.data.data.length < numOfRows) {
        setIsEnd(true);
      }
      setIsLoading(false);
      setRefresh(false);
    };
    fetchOrders();
  }, [pageNo, numOfRows, refresh]);

  const handleRefresh = () => {
    console.log(pageNo, isEnd);
    if (pageNo === 1 && isEnd) {
      setRefresh(true);
    } else {
      setPageNo(1);
      setIsEnd(false);
      setRefresh(true);
    }
  };

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.titleWrapper}>
        <h2 className={styles.title}>수락한 배달 조회</h2>
      </div>
      <div className={styles.tabBar}>
        {orders.length === 0 && (
          <div className={styles.emptyWrapper}>배달 중인 주문이 없습니다.</div>
        )}
        {isLoading && (
          <div className={styles.loadingWrapper}>
            <CircularProgress />
          </div>
        )}
        {orders.length > 0 && (
          <RiderOrderGrid orders={orders} fetchOrders={handleRefresh} accepted />
        )}
        {!isEnd && orders.length !== 0 && (
          <Button onClick={() => setPageNo(pageNo + 1)}>더 보기 +</Button>
        )}
      </div>
    </div>
  );
}

export default AcceptedListPage;
