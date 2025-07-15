/* eslint-disable import/no-unresolved */
/* eslint-disable import/extensions */
/* eslint-disable react/no-array-index-key */
/* eslint-disable react/function-component-definition */
import React from 'react';
import PropTypes from 'prop-types';
import ModalWrapper from '@/common/modals/ModalWrapper';
import { formattedDate, orderStatus } from '@/common/utils/orderUtils';

const AdminOrderDetailModal = ({ onClose, order }) => {
  return (
    <ModalWrapper title="주문 내역" onClose={onClose}>
      <div>
        <div className="orderDetailHeader">
          <span>
            주문 번호: {order.orderId} / 주문 날짜: {formattedDate(order.createdAt)}
          </span>
          <span>{orderStatus[order.orderState]}</span>
        </div>
        <div className="orderDetailBody">
          <div className="DetailBodyRow">
            <span>주문자 정보</span>
            <span>아이디 : {order.loginId}</span>
            <span>닉네임 : {order.nickname}</span>
            <span>전화번호 : {order.phone}</span>
            <span>
              주소 : {order.roadFull} {order.address}
            </span>
          </div>
          <div className="DetailBodyRow">
            <span>결제 정보</span>
            <span>결제 방법 : {order.payMethod}</span>
            <span>결제 금액 : {order.totalPrice}</span>
          </div>
          <div className="DetailBodyRow">
            <span>배송 가게 정보</span>
            <span>가게 지점명 : {order.shopName}</span>
            <span>가게 담당자 : {order.ownerName}</span>
            <span>가게 주소 : {order.shopAddress}</span>
            <span>가게 전화번호 : {order.shopPhone}</span>
          </div>
          <div className="DetailBodyRow">
            <span>라이더 정보</span>
            <span>라이더 이름 : {order.riderName}</span>
            <span>라이더 전화번호 : {order.riderPhone}</span>
          </div>
          <div className="DetailBodyRow">
            <span>주문 상품</span>
            {order.cooks.map((item, idx) => (
              <div key={item.cookName + idx}>
                <span>요리 이름 : {item.cookName}</span>
                <span>기본 식재료</span>
                {item.baseIngredients.map(ingredient => (
                  <span key={ingredient + Math.random()}>{ingredient}</span>
                ))}
                <span>추가 식재료</span>
                {item.additionalIngredients.map(ingredient => (
                  <span key={ingredient + Math.random()}>{ingredient}</span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </ModalWrapper>
  );
};

AdminOrderDetailModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  order: PropTypes.shape({
    orderId: PropTypes.string.isRequired,
    createdAt: PropTypes.string.isRequired,
    orderState: PropTypes.string.isRequired,
    loginId: PropTypes.string,
    nickname: PropTypes.string,
    phone: PropTypes.string,
    roadFull: PropTypes.string,
    address: PropTypes.string,
    payMethod: PropTypes.string,
    totalPrice: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    shopName: PropTypes.string,
    ownerName: PropTypes.string,
    shopAddress: PropTypes.string,
    shopPhone: PropTypes.string,
    riderName: PropTypes.string,
    riderPhone: PropTypes.string,
    cooks: PropTypes.arrayOf(
      PropTypes.shape({
        cookName: PropTypes.string,
        baseIngredients: PropTypes.arrayOf(PropTypes.string),
        additionalIngredients: PropTypes.arrayOf(PropTypes.string),
      })
    ),
  }).isRequired,
};

export default AdminOrderDetailModal;
