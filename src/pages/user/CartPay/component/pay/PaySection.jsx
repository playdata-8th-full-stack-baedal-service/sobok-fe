import React from 'react';
import styles from '../../CartPayPage.module.scss';
import CheckoutPage from '../../../Pay/toss/Checkout';

const PaySection = () => {
  return (
    <div className={styles.paySection}>
      {/* 주문자 정보 */}
      <section>
        <h3>주문자 정보</h3>
        <div>
          <div>
            <label htmlFor="orderer">주문자</label>
            <input id="orderer" type="text" value={orderer.nickname} readOnly />
          </div>
          <div>
            <label htmlFor="phone">전화번호</label>
            <input id="phone" type="text" value={orderer.phone} readOnly />
          </div>
        </div>
      </section>

      {/* 배송 정보 */}
      <section>
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
      <section>
        <CheckoutPage orderer={orderer} shipping={shipping} ready={goPay} totalPrice={totalPrice} />
      </section>
      {/* 결제 버튼 */}
      {onRender && (
        <footer>
          <span>총 금액 {shipping.totalPrice.toLocaleString()} 원</span>
          <button type="button" onClick={handlePayment}>
            결제 하기
          </button>
        </footer>
      )}
    </div>
  );
};

export default PaySection;
