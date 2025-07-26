/* eslint-disable react-hooks/exhaustive-deps */
import { loadTossPayments } from '@tosspayments/tosspayments-sdk';
import { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import useToast from '@/common/hooks/useToast';
import generateRandomString from '../../../../../common/utils/paymentUtils';
import { setError } from '../../../../../store/cartPaySlice';
import axiosInstance from '../../../../../services/axios-config';

const clientKey = 'test_gck_docs_Ovk5rk1EwkEbP0W43n07xlzm';
const customerKey = 'fuvcoqV8JaQDkDPczoS_S';

export default function Checkout() {
  const dispatch = useDispatch();
  const { orderer, totalPrice } = useSelector(state => state.pay);
  const { showNegative } = useToast();

  const [amount] = useState({
    currency: 'KRW',
    value: totalPrice,
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

    return () => {
      setWidgets(null);
    };
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
  }, [widgets]);

  useEffect(() => {
    if (widgets === null) return;
    widgets.setAmount({
      currency: 'KRW',
      value: totalPrice,
    });
  }, [widgets, totalPrice]);

  // useEffect(() => {
  //   if (ready) {
  //     buttonRef.current.click();
  //   }
  // }, [ready]);

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
          // style={{ display: 'none' }}
          ref={buttonRef}
          onClick={async () => {
            if (totalPrice === 0) {
              showNegative('0원 이하로는 주문할 수 없습니다.');
              return;
            }

            const orderId = generateRandomString();
            try {
              // ------ '결제하기' 버튼 누르면 결제창 띄우기 ------
              // 결제를 요청하기 전에 orderId, amount를 서버에 저장하세요.
              // 결제 과정에서 악의적으로 결제 금액이 바뀌는 것을 확인하는 용도입니다.
              await widgets.requestPayment({
                orderId,
                orderName: `주문 번호:${orderId}`,
                successUrl: `${window.location.origin}/user/tossSuccess`,
                failUrl: `${window.location.origin}/user/tossFail`,
                customerEmail: orderer.email,
                customerName: orderer.nickname,
                customerMobilePhone: orderer.phone,
              });
            } catch (error) {
              // 에러 처리하기
              dispatch(setError('결제에 실패했습니다. 다시 시도해주세요.'));
              window.location.reload();
            }
          }}
        >
          결제하기
        </button>
      </div>
    </div>
  );
}
