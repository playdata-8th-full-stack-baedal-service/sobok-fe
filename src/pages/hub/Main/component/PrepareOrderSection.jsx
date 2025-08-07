/* eslint-disable react/function-component-definition */
import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styles from '../MainPage.module.scss';
import OrderList from './OrderList';
import { fetchPreparingOrders, setPendingOrder } from '../../../../store/hubSlice';
import PagingFooter from './PagingFooter';

const PrepareOrderSection = () => {
  const dispatch = useDispatch();
  const [orders, setOrders] = useState([]);
  const [max, setMax] = useState(Number.MAX_SAFE_INTEGER);

  const [pageNo, setPageNo] = useState(1);
  const [numOfRows, setNumOfRows] = useState(5);

  const { pendingOrders, pollingOrders } = useSelector(state => state.hub);

  useEffect(() => {
    dispatch(
      fetchPreparingOrders({
        orderState: 'PREPARING_INGREDIENTS',
      })
    );
  }, [dispatch]);

  useEffect(() => {
    if (pendingOrders === null || pendingOrders.length === 0) return;

    setMax(Math.ceil(pendingOrders.length / numOfRows));
    setOrders(pendingOrders.slice((pageNo - 1) * numOfRows, pageNo * numOfRows));
  }, [pendingOrders, pageNo, numOfRows]);

  // 폴링 - 5초마다 첫 페이지 체크
  useEffect(() => {
    dispatch(
      fetchPreparingOrders({
        orderState: 'PREPARING_INGREDIENTS',
        isPolling: true,
      })
    );

    const interval = setInterval(() => {
      dispatch(
        fetchPreparingOrders({
          orderState: 'PREPARING_INGREDIENTS',
          isPolling: true,
        })
      );
    }, 1000);

    return () => clearInterval(interval);
  }, [dispatch]);

  useEffect(() => {
    if (pollingOrders === null && pendingOrders !== null) {
      setOrders([]);
      return;
    }

    if (pendingOrders === null && pollingOrders !== null) {
      setOrders(pollingOrders);
      setPageNo(1);
      return;
    }

    if (pollingOrders === null && pendingOrders === null) {
      setOrders([]);
      return;
    }

    if (pollingOrders.length === 0 && pendingOrders.length === 0) {
      setOrders([]);
      return;
    }

    // 더 정확한 데이터 변경 감지
    const hasChanged =
      pollingOrders.length !== pendingOrders.length ||
      // 길이가 같더라도 내용이 다를 수 있음
      pollingOrders.some((pollingOrder, index) => {
        const pendingOrder = pendingOrders[index];
        return !pendingOrder || pollingOrder.orderId !== pendingOrder.orderId;
      }) ||
      // 역방향 체크도 추가 (pendingOrder에 있는데 pollingOrder에 없는 경우)
      pendingOrders.some((pendingOrder, index) => {
        const pollingOrder = pollingOrders[index];
        return !pollingOrder || pendingOrder.orderId !== pollingOrder.orderId;
      });

    if (hasChanged) {
      setPageNo(1); // 첫 페이지로 이동
      dispatch(setPendingOrder(pollingOrders));
    }
  }, [pollingOrders, pendingOrders, dispatch]);

  // 페이지 변경 핸들러
  const changePageNo = page => {
    if (orders === null || orders.length === 0) {
      setPageNo(1);
      return;
    }
    if (page < 1) return;
    if (page > max) return;
    setPageNo(page);
  };

  return (
    <main className={styles.main}>
      <div className={styles.searchBar}>
        <h2>준비중인 주문</h2>
      </div>
      <OrderList orders={orders} />
      <PagingFooter pageNo={pageNo} setPageNo={changePageNo} />
    </main>
  );
};

export default PrepareOrderSection;
