/* eslint-disable react/function-component-definition */
import React from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { openModal } from '../../../../store/modalSlice';
import Button from '../../../../common/components/Button';
import { formattedDate } from '../../../../common/utils/orderUtils';

const OrderGrid = ({ orders }) => {
  const dispatch = useDispatch();

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
      {orders.map((order, index) => (
        <div key={order.orderId}>
          <div>
            <span>{index + 1}/</span>
            <span>{order.orderId.toUpperCase()}/</span>
            <span>{formattedDate(order.createdAt)}</span>
          </div>
          <div>
            <Button onClick={() => handleOrderDetailClick(order)}>주문 상세보기</Button>
          </div>
        </div>
      ))}
    </div>
  );
};

OrderGrid.propTypes = {
  orders: PropTypes.arrayOf(
    PropTypes.shape({
      orderId: PropTypes.string.isRequired,
      createdAt: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default OrderGrid;
