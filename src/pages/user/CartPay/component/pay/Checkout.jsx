/* eslint-disable react-hooks/exhaustive-deps */
import { loadTossPayments } from '@tosspayments/tosspayments-sdk';
import { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import useToast from '@/common/hooks/useToast';
import {
  restorePayment,
  setError,
  setIsReady,
  setPayClick,
} from '../../../../../store/cartPaySlice';
import axiosInstance from '../../../../../services/axios-config';
import styles from '../../CartPayPage.module.scss';

const clientKey = 'test_gck_docs_Ovk5rk1EwkEbP0W43n07xlzm';
const customerKey = 'fuvcoqV8JaQDkDPczoS_S';

export default function Checkout() {
  const dispatch = useDispatch();
  const { orderer, totalPrice, payClick, orderId } = useSelector(state => state.pay);
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

      dispatch(setIsReady(true));
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

  useEffect(() => {
    if (payClick) {
      buttonRef.current.click();
      dispatch(setPayClick(false));
    }
  }, [payClick]);

  return (
    <div className={styles.wrapper}>
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
            if (totalPrice === 0) {
              showNegative('0원 이하로는 주문할 수 없습니다.');
              return;
            }

            try {
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
              if (widgets !== null) {
                dispatch(restorePayment({ orderId }));
              }
            }
          }}
        >
          결제하기
        </button>
      </div>
    </div>
  );
}
