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
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
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
                return shopInfo.map(shop => (
                  <div
                    key={shop.shopId}
                    style={{ border: '1px solid #ddd', padding: '10px', borderRadius: '5px' }}
                  >
                    <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>{shop.shopName}</div>
                    {shop.satisfiable ? (
                      <div style={{ color: '#61a059' }}>주문 가능</div>
                    ) : (
                      <div style={{ color: 'crimson' }}>
                        <div style={{ marginBottom: '5px' }}>재료 부족으로 주문 불가</div>
                        <div style={{ fontSize: '14px' }}>
                          부족한 재료:
                          {shop.missingIngredients.map((ingredient, idx) => (
                            <span key={ingredient.ingredientId}>
                              {idx > 0 ? ', ' : ' '}
                              {ingredient.ingredientName} (보유: {ingredient.quantity})
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ));
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
