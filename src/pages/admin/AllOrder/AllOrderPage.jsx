import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import Button from '../../../common/components/Button';
import axiosInstance from '../../../services/axios-config';
import { openModal } from '../../../store/modalSlice';

function AllOrderPage() {
  const dispatch = useDispatch();

  const [orders, setOrders] = useState([]);
  const [pageNo, setPageNo] = useState(1);
  const [numOfRows] = useState(10);
  const [isFullLoaded, setIsFullLoaded] = useState(false);

  const formattedDate = orderDate => {
    const date = new Date(orderDate);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  };

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

  // 주문 상세보기 클릭
  const handleOrderDetailClick = order => {
    dispatch(
      openModal({
        type: 'ADMIN_ORDER_DETAIL',
        props: {
          order,
        },
      })
    );
  };

  return (
    <div>
      <h1>주문 내역</h1>
      {orders.map((order, index) => (
        <div key={order.orderId}>
          <div>
            <span>{index + 1}/</span>
            <span>{order.orderId}/</span>
            <span>{formattedDate(order.createdAt)}</span>
          </div>
          <div>
            <Button onClick={() => handleOrderDetailClick(order)}>주문 상세보기</Button>
          </div>
        </div>
      ))}
      {!isFullLoaded && (
        <div>
          <Button onClick={() => setPageNo(pageNo + 1)}>더보기 +</Button>
        </div>
      )}
    </div>
  );
}

export default AllOrderPage;
