import React, { useEffect, useState } from 'react';
import axiosInstance from '../../../services/axios-config';
import CheckoutPage from './toss/Checkout';

const generateRandomString = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = 'Sobok-';
  for (let i = 0; i < 10; i += 1) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

function PayPage() {
  const [orderer, setOrderer] = useState({
    userId: 0,
    nickname: '',
    phone: '',
    addresses: [
      {
        id: 0,
        roadFull: '',
        addrDetail: '',
      },
    ],
    email: null,
  });

  const [shipping, setShipping] = useState({
    orderId: generateRandomString(),
    riderRequest: '',
    totalPrice: 1,
    userAddress: 0,
    cartCookIdList: [],
  });

  const [ready, isReady] = useState(false);
  const [goPay, letsgopay] = useState(false);

  useEffect(() => {
    const fetchOrdererInfo = async () => {
      try {
        const response = await axiosInstance.get(`user-service/user/preOrderUser`);
        console.log(response.data);

        setOrderer(prev => ({
          ...prev,
          userId: response.data.data.userId,
          nickname: response.data.data.nickname,
          phone: response.data.data.phone,
          addresses: response.data.data.addresses,
        }));

        setShipping(prev => ({
          ...prev,
          userAddress: response.data.data.addresses[0].id,
        }));
      } catch (err) {
        console.log(err.response.data);
      }
    };

    fetchOrdererInfo();
  }, []);

  useEffect(() => {
    if (!ready) return;

    const requestData = async () => {
      try {
        alert(shipping.userAddress);
        const response = await axiosInstance.post(
          '/payment-service/payment/register',
          {
            orderId: shipping.orderId,
            totalPrice: shipping.totalPrice,
            riderRequest: shipping.riderRequest,
            userAddressId: shipping.userAddress,
            cartCookIdList: shipping.cartCookIdList,
          },
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );
        console.log(response);

        isReady(false);
        letsgopay(true);
      } catch (err) {
        console.log(err.response.data);
      }
    };

    requestData();
  }, [
    ready,
    shipping.cartCookIdList,
    shipping.orderId,
    shipping.riderRequest,
    shipping.totalPrice,
    shipping.userAddress,
  ]);

  const handlePayment = () => {
    isReady(true);
  };

  const handleAddressChange = () => {
    // 주소를 바꿀 수 있는 모달 창 떠야함
    // shipping.userAddress 변경
    console.log('address change');
  };

  return (
    <div className="payment-page">
      <h2>결제하기</h2>

      {/* 주문자 정보 */}
      <section className="orderer-info box">
        <h3>주문자 정보</h3>
        <div>
          <input type="text" value={orderer.nickname} readOnly />
          <input type="text" value={orderer.phone} readOnly />
        </div>
      </section>

      {/* 배송 정보 */}
      <section className="shipping-info box">
        <h3>배송 정보</h3>
        <div>
          <textarea value={orderer.addresses[0].roadFull || ''} readOnly />
          <button type="button" onClick={handleAddressChange}>
            변경
          </button>
        </div>
        <input
          type="text"
          placeholder="배달원 요청사항"
          value={shipping.riderRequest}
          onChange={e => setShipping(prev => ({ ...prev, riderRequest: e.target.value }))}
        />
      </section>

      {/* 결제 수단 */}
      <section className="payment-method box">
        <h3>결제 수단</h3>
        <CheckoutPage orderer={orderer} shipping={shipping} ready={goPay} />
      </section>
      {/* 결제 버튼 */}
      <footer className="payment-footer">
        <span>총 금액 {shipping.totalPrice.toLocaleString()} 원</span>
        <button type="button" onClick={handlePayment}>
          결제 하기
        </button>
      </footer>
    </div>
  );
}

export default PayPage;
