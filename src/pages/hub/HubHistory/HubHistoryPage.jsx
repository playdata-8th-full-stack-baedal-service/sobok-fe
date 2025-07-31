/* eslint-disable react/function-component-definition */
import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import axiosInstance from '../../../services/axios-config';
import styles from './HubHistoryPage.module.scss';
import OrderList from '../Main/component/OrderList';
import { openModal } from '../../../store/modalSlice';
import PagingFooter from '../Main/component/PagingFooter';
import { setError } from '../../../store/hubSlice';

const HubHistoryPage = () => {
  const [orders, setOrders] = useState([]);

  const [pageNo, setPageNo] = useState(1);
  const [max, setMax] = useState(Number.MAX_SAFE_INTEGER);
  const numOfRows = 10;

  const [loading, setLoading] = useState(false);
  const [isFullLoaded, setIsFullLoaded] = useState(false);

  const dispatch = useDispatch();

  // // 주문 상세 모달 열기
  // const handleOpenOrderDetailModal = order => {
  //   dispatch(
  //     openModal({
  //       type: 'SHOP_ORDER_DETAIL',
  //       props: {
  //         order,
  //       },
  //     })
  //   );
  // };

  useEffect(() => {
    const fetchCompletedOrders = async () => {
      try {
        const response = await axiosInstance.get('/shop-service/shop/all-order');

        const data = response?.data?.data || [];

        setOrders(data.slice((pageNo - 1) * numOfRows, pageNo * numOfRows));
        setMax(Math.ceil(data.length / numOfRows));
      } catch (err) {
        dispatch(setError(err.response?.data?.message || '오류'));
      }
    };

    fetchCompletedOrders();
  }, [dispatch, pageNo]);

  // 페이지 변경 핸들러
  const changePageNo = page => {
    if (page < 1) return;
    if (page > max) return;
    setPageNo(page);
  };

  return (
    <main className={styles.main}>
      <div className={styles.searchBar}>
        <h2>가게 주문 모아보기</h2>
      </div>
      <OrderList orders={orders} />
      <PagingFooter pageNo={pageNo} setPageNo={changePageNo} />
    </main>
  );
};

export default HubHistoryPage;
