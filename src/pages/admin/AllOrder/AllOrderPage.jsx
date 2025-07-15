import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import Button from '../../../common/components/Button';
import axiosInstance from '../../../services/axios-config';
import OrderGrid from './component/OrderGrid';

function AllOrderPage() {
  const [orders, setOrders] = useState([]);
  const [pageNo, setPageNo] = useState(1);
  const [numOfRows] = useState(10);
  const [isFullLoaded, setIsFullLoaded] = useState(false);

  // 주문 내역 조회
  useEffect(() => {
    const fetchOrders = async () => {
      const response = await axiosInstance.get('/admin-service/admin/orders', {
        params: {
          page: pageNo,
          size: numOfRows,
        },
      });
      setOrders(prev => [...prev, ...response.data.data.content]);
      if (response.data.data.content.length < numOfRows) {
        setIsFullLoaded(true);
      }
    };
    fetchOrders();
  }, [pageNo, numOfRows]);

  return (
    <div>
      <h1>주문 내역</h1>
      <OrderGrid orders={orders} />
      {!isFullLoaded && (
        <div>
          <Button onClick={() => setPageNo(pageNo + 1)}>더보기 +</Button>
        </div>
      )}
    </div>
  );
}

export default AllOrderPage;
