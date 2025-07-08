import { loadTossPayments } from '@tosspayments/tosspayments-sdk';
import { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';

const clientKey = 'test_gck_docs_Ovk5rk1EwkEbP0W43n07xlzm';
const customerKey = 'fuvcoqV8JaQDkDPczoS_S';

// 랜덤 10자리 문자열 생성 함수
const generateRandomString = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = 'Sobok-';
  for (let i = 0; i < 10; i += 1) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

export default function CheckoutPage({ orderer, shipping, ready }) {
  const [amount] = useState({
    currency: 'KRW',
    value: shipping.totalPrice,
  });
  const [widgets, setWidgets] = useState(null);
  const buttonRef = useRef(null);

  useEffect(() => {
    async function fetchPaymentWidgets() {
      // ------  결제위젯 초기화 ------
      const tossPayments = await loadTossPayments(clientKey);
      // 회원 결제
      const paymentWidgets = tossPayments.widgets({
        customerKey,
      });

      setWidgets(paymentWidgets);
    }

    fetchPaymentWidgets();
  }, []);

  useEffect(() => {
    async function renderPaymentWidgets() {
      if (widgets == null) {
        return;
      }
      // ------ 주문의 결제 금액 설정 ------
      await widgets.setAmount(amount);

      await Promise.all([
        // ------  결제 UI 렌더링 ------
        widgets.renderPaymentMethods({
          selector: '#payment-method',
          variantKey: 'DEFAULT',
        }),
        // ------  이용약관 UI 렌더링 ------
        widgets.renderAgreement({
          selector: '#agreement',
          variantKey: 'AGREEMENT',
        }),
      ]);
    }

    renderPaymentWidgets();
  }, [widgets, amount]);

  useEffect(() => {
    if (widgets == null) {
      return;
    }

    widgets.setAmount(amount);
  }, [widgets, amount]);

  useEffect(() => {
    if (ready) {
      buttonRef.current.click();
    }
  }, [ready]);

  return (
    <div className="wrapper">
      <div className="box_section">
        {/* 결제 UI */}
        <div id="payment-method" />
        {/* 이용약관 UI */}
        <div id="agreement" />
        {/* 결제하기 버튼 */}
        <button
          type="button"
          className="button"
          style={{ display: 'none' }}
          ref={buttonRef}
          onClick={async () => {
            try {
              // ------ '결제하기' 버튼 누르면 결제창 띄우기 ------
              // 결제를 요청하기 전에 orderId, amount를 서버에 저장하세요.
              // 결제 과정에서 악의적으로 결제 금액이 바뀌는 것을 확인하는 용도입니다.
              await widgets.requestPayment({
                orderId: shipping.orderId,
                orderName: `주문 번호:${shipping.orderId}`,
                successUrl: `${window.location.origin}/user/tossSuccess`,
                failUrl: `${window.location.origin}/user/tossFail`,
                customerEmail: orderer.email,
                customerName: orderer.nickname,
                customerMobilePhone: orderer.phone,
              });
            } catch (error) {
              // 에러 처리하기
              console.error(error);
            }
          }}
        >
          결제하기
        </button>
      </div>
    </div>
  );
}

CheckoutPage.propTypes = {
  orderer: PropTypes.shape({
    userId: PropTypes.number,
    nickname: PropTypes.string,
    phone: PropTypes.string,
    address: PropTypes.arrayOf(
      PropTypes.shape({
        roadFull: PropTypes.string,
        addrDetail: PropTypes.string,
      })
    ),
    email: PropTypes.string,
  }).isRequired,
  shipping: PropTypes.shape({
    orderId: PropTypes.string,
    riderRequest: PropTypes.string,
    totalPrice: PropTypes.number,
    userAddress: PropTypes.number,
    cartCookIdList: PropTypes.arrayOf(PropTypes.number),
  }).isRequired,
  ready: PropTypes.bool.isRequired,
};
