import React, { useState, useEffect } from 'react';
import { CircularProgress } from '@mui/material';
import axiosInstance from '../../../services/axios-config';
import Button from '../../../common/components/Button';
import RiderOrderGrid from './component/RiderOrderGrid';
import styles from './RequestListPage.module.scss';

function RequestListPage() {
  const [position, setPosition] = useState(null);
  const [pageNo, setPageNo] = useState(1);
  const [numOfRows] = useState(10);
  const [refresh, setRefresh] = useState(false);
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEnd, setIsEnd] = useState(false);

  // 위치 정보 가져오기
  const getPosition = () => {
    navigator.geolocation.getCurrentPosition(
      pos => {
        setPosition({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        });
      },
      error => {
        console.log(error);
      }
    );
  };

  // 위치 정보 갱신 시 호출
  useEffect(() => {
    if (refresh) {
      getPosition();
    }

    setRefresh(false);
  }, [refresh]);

  // 거리 계산 후 주문 목록 가져오기
  const getDistance = async () => {
    if (!position) return;
    const response = await axiosInstance.get(
      `/delivery-service/delivery/available-order?latitude=${position.latitude}&longitude=${position.longitude}&pageNo=${pageNo}&numOfRows=${numOfRows}`
    );
    console.log('response', response);
    const orderList = response?.data?.data ?? []; // null일 경우 []로 대체

    if (pageNo === 1) {
      setOrders(orderList);
    } else {
      setOrders(prev => [...prev, ...orderList]);
    }

    if (orderList.length < numOfRows) {
      setIsEnd(true);
    }
    setIsLoading(false);
  };

  // 주문 목록 가져오기
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      if (!position) {
        setRefresh(true);
      }
      await getDistance();
    };

    fetchData();
  }, [pageNo, numOfRows, position]);

  // 위치 정보 갱신 버튼 클릭 시 호출
  const handleRefresh = () => {
    if (pageNo === 1 && isEnd) {
      setRefresh(true);
      setPageNo(1);
    } else {
      setRefresh(true);
      setPageNo(1);
      setIsEnd(false);
    }
  };

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.titleWrapper}>
        <h2 className={styles.title}>배달 가능 주문 목록</h2>
        <Button onClick={handleRefresh} className={styles.refreshBtn}>
          위치 정보 갱신
        </Button>
      </div>
      <div className={styles.tabBar}>
        {!isLoading && orders.length === 0 && (
          <div className={styles.emptyWrapper}>배달 가능한 주문이 없습니다.</div>
        )}
        {isLoading && (
          <div className={styles.loadingWrapper}>
            <CircularProgress />
          </div>
        )}
        {orders.length > 0 && <RiderOrderGrid orders={orders} fetchOrders={handleRefresh} />}
        {!isEnd && orders.length !== 0 && (
          <Button onClick={() => setPageNo(pageNo + 1)}>더 보기 +</Button>
        )}
      </div>
    </div>
  );
}

export default RequestListPage;
