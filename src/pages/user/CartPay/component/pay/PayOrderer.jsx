/* eslint-disable react/function-component-definition */
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styles from '../../CartPayPage.module.scss';
import { setRiderRequest } from '../../../../../store/cartPaySlice';
import { openModal } from '../../../../../store/modalSlice';

const PayOrderer = () => {
  const dispatch = useDispatch();
  const { orderer, selectedAddressId, shopInfo, loading, shopError } = useSelector(
    state => state.pay
  );

  const handleChangeAddress = () => {
    dispatch(openModal('PAY_ADDRESS_CHANGE'));
  };

  return (
    <section className={styles.orderer}>
      <div className={styles.wrapper}>
        <div>
          {/* 주문자 */}
          <h4>주문자</h4>
          <div>{orderer?.nickname}</div>

          {/* 배송 정보 */}

          <h4>배송 정보</h4>
          <div className={styles.addressSelect}>
            <span>
              {orderer?.addresses?.find(addr => addr.id === selectedAddressId)?.roadFull}
              <br />
              {orderer?.addresses?.find(addr => addr.id === selectedAddressId)?.addrDetail}
            </span>
            <button type="button" className={styles.btnAddrChange} onClick={handleChangeAddress}>
              주소 변경
            </button>
          </div>

          {/* 가게 정보 */}
          <h4>배달 가능한 가게 정보</h4>
          <div style={{ display: 'flex', color: '#61a059' }}>
            {(() => {
              if (loading) {
                return <div>가게 정보를 조회 중입니다...</div>;
              }
              if (shopError) {
                return (
                  <div style={{ color: 'crimson', fontWeight: '500' }}>
                    선택한 주소지에 가까운 가게를 찾지 못했습니다.
                  </div>
                );
              }
              if (shopInfo && shopInfo.length > 0) {
                return shopInfo.map((shop, index) =>
                  index === 0 ? (
                    <div key={shop.shopId}>{shop.shopName}</div>
                  ) : (
                    <div key={shop.shopId}>,&nbsp;{shop.shopName}</div>
                  )
                );
              }
              return (
                <div style={{ color: 'crimson', fontWeight: '500' }}>
                  배달 가능한 가게가 없습니다.
                </div>
              );
            })()}
          </div>

          {/* 라이더 요청사항 */}
          <h4>라이더 요청사항</h4>
          <input
            placeholder="요청사항을 적어주세요!"
            onChange={e => {
              dispatch(setRiderRequest(e.target.value));
            }}
          />
        </div>
      </div>
    </section>
  );
};

export default PayOrderer;
