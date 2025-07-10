import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import axiosInstance from '../../../services/axios-config';
import CheckoutPage from './toss/Checkout';
import generateRandomString from '../../../common/utils/paymentUtils';
import { openModal } from '../../../store/modalSlice';

function PayPage() {
  const navigate = useNavigate();
  const [totalPrice, setTotalPrice] = useState(0);
  const [selectedItems, setSelectedItems] = useState([]);
  const dispatch = useDispatch();

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
    totalPrice,
    userAddressIdx: 0,
    cartCookIdList: selectedItems,
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
          email: response.data.data.email || 'example@example.com',
        }));

        setShipping(prev => ({
          ...prev,
          totalPrice: response.data.data.totalPrice,
          cartCookIdList: response.data.data.selectedItems,
        }));

        console.log(response.data.data.totalPrice);
        setTotalPrice(response.data.data.totalPrice);
        setSelectedItems(response.data.data.selectedItems);
      } catch (err) {
        console.log(err.response.data);
        alert('주문자 정보를 불러오는 과정에서 오류가 발생하였습니다. 잠시 후 다시 시도해주세요.');
        navigate('/user/cart');
      }
    };

    fetchOrdererInfo();
  }, [navigate]);

  useEffect(() => {
    if (!ready) return;

    const requestData = async () => {
      try {
        const response = await axiosInstance.post(
          '/payment-service/payment/register',
          {
            orderId: shipping.orderId,
            totalPrice,
            riderRequest: shipping.riderRequest,
            userAddressId: orderer.addresses[shipping.userAddressIdx].id,
            cartCookIdList: selectedItems,
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
  }, [ready]);

  const handlePayment = () => {
    isReady(true);
  };

  const handleAddressChange = () => {
    // 주소를 바꿀 수 있는 모달 창 떠야함
    // shipping.userAddress 변경

    dispatch(openModal('address-change'));
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
        <CheckoutPage orderer={orderer} shipping={shipping} ready={goPay} totalPrice={totalPrice} />
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
