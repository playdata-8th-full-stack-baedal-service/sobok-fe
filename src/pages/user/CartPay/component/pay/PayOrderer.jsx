/* eslint-disable react/function-component-definition */
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styles from '../../CartPayPage.module.scss';
import { setRiderRequest } from '../../../../../store/cartPaySlice';
import { openModal } from '../../../../../store/modalSlice';

const PayOrderer = () => {
  const dispatch = useDispatch();
  const { orderer, selectedAddressId, error } = useSelector(state => state.pay);

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
              {orderer?.addresses[selectedAddressId]?.roadFull}
              <br />
              {orderer?.addresses[selectedAddressId]?.addrDetail}
            </span>
            <button type="button" className={styles.btnAddrChange} onClick={handleChangeAddress}>
              주소 변경
            </button>
          </div>

          {/* 가게 정보 */}

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
