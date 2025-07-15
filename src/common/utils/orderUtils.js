/* eslint-disable import/prefer-default-export */
export const formattedDate = orderDate => {
  const date = new Date(orderDate);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
};

export const orderStatus = {
  ORDER_PENDING: '결제 대기',
  ORDER_COMPLETE: '결제 완료',
  PREPARING_INGREDIENTS: '재료 준비중',
  READY_FOR_DELIVERY: '재료 준비 완료',
  DELIVERY_ASSIGNED: '배송 준비중',
  DELIVERING: '배송 중',
  DELIVERY_COMPLETE: '배송 완료',
};
