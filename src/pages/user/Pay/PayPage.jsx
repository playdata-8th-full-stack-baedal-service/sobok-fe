import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axiosInstance from '../../../services/axios-config';
import CheckoutPage from './toss/Checkout';
import generateRandomString from '../../../common/utils/paymentUtils';
import { openModal } from '../../../store/modalSlice';
import { setAddresses, setSelectedAddress } from '../../../store/cartSlice';
import styles from './PayPage.module.scss';

function PayPage() {
  const navigate = useNavigate();
  const [totalPrice, setTotalPrice] = useState(0);
  const [selectedItems, setSelectedItems] = useState([]);
  const dispatch = useDispatch();
  const { selectedAddress } = useSelector(state => state.cart);
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
  const [onRender, setOnRender] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setOnRender(true);
    }, 1000);
  }, [ready]);

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

        if (response.data.data.addresses === null || response.data.data.addresses.length < 1) {
          alert('주소를 등록해주세요.');
          navigate('/user');
          return;
        }
        dispatch(setAddresses(response.data.data.addresses));
        dispatch(setSelectedAddress(response.data.data.addresses[0].id));

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
  }, [navigate, dispatch]);

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
            userAddressId: selectedAddress,
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
        alert('결제에 실패했습니다. 다시 시도해주세요.');
        const res = await axiosInstance.delete(
          `/payment-service/payment/fail-payment?orderId=${shipping.orderId}`
        );
        console.log(res);
        navigate('/user/cart');
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
    dispatch(openModal('PAY_ADDRESS_CHANGE'));
  };

  return (
    <div className={styles.paymentPage}>
      <h2>결제하기</h2>

      {/* 주문자 정보 */}
      <section className={styles.ordererInfo}>
        <h3>주문자 정보</h3>
        <div className={styles.ordererFields}>
          <div className={styles.fieldGroup}>
            <label htmlFor="orderer">주문자</label>
            <input id="orderer" type="text" value={orderer.nickname} readOnly />
          </div>
          <div className={styles.fieldGroup}>
            <label htmlFor="phone">전화번호</label>
            <input id="phone" type="text" value={orderer.phone} readOnly />
          </div>
        </div>
      </section>

      {/* 배송 정보 */}
      <section className={styles.shippingInfo}>
        <h3>배송 정보</h3>
        <div>
          <textarea
            value={
              orderer.addresses.find(address => address.id === selectedAddress)?.roadFull || ''
            }
            readOnly
          />
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
      <section className={styles.paymentMethod}>
        <CheckoutPage orderer={orderer} shipping={shipping} ready={goPay} totalPrice={totalPrice} />
      </section>
      {/* 결제 버튼 */}
      {onRender && (
        <footer className={styles.paymentFooter}>
          <span>총 금액 {shipping.totalPrice.toLocaleString()} 원</span>
          <button type="button" onClick={handlePayment}>
            결제 하기
          </button>
        </footer>
      )}
    </div>
  );
}

export default PayPage;
