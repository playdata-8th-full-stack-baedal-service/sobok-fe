/* eslint-disable react/function-component-definition */
import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styles from '../MainPage.module.scss';
import OrderList from './OrderList';
import { fetchPreparingOrders, setCompleteMax } from '../../../../store/hubSlice';
import PagingFooter from './PagingFooter';

const ShopDeliveryPendingSection = () => {
  const dispatch = useDispatch();
  const [orders, setOrders] = useState([]);
  const [max, setMax] = useState(Number.MAX_SAFE_INTEGER);

  const [pageNo, setPageNo] = useState(1);
  const [numOfRows, setNumOfRows] = useState(5);

  const { completeOrders } = useSelector(state => state.hub);

  useEffect(() => {
    dispatch(
      fetchPreparingOrders({
        orderState: 'READY_FOR_DELIVERY',
      })
    );
  }, [dispatch]);

  useEffect(() => {
    if (completeOrders === null || completeOrders.length === 0) return;

    setOrders(completeOrders.slice((pageNo - 1) * numOfRows, pageNo * numOfRows));
    setMax(Math.ceil(completeOrders.length / numOfRows));
  }, [completeOrders, pageNo, numOfRows]);

  // 페이지 변경 핸들러
  const changePageNo = page => {
    if (page < 1) return;
    if (page > max) return;
    setPageNo(page);
  };

  return (
    <main className={styles.main}>
      <div className={styles.searchBar}>
        <h2>완료된 주문</h2>
      </div>
      <OrderList orders={orders} />
      <PagingFooter pageNo={pageNo} setPageNo={changePageNo} />
    </main>
  );
};

export default ShopDeliveryPendingSection;
