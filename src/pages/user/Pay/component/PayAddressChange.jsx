/* eslint-disable react/function-component-definition */
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ModalWrapper from '../../../../common/modals/ModalWrapper';
import { setSelectedAddress } from '../../../../store/cartSlice';
import styles from './PayAddressChange.module.scss';

const PayAddressChange = ({ onClose }) => {
  const dispatch = useDispatch();
  const { addresses, selectedAddress } = useSelector(state => state.cart);

  return (
    <ModalWrapper title="주소 변경" onClose={onClose}>
      <div className={styles.addressModal}>
        <p className={styles.addressModal__desc}>주소를 변경하려면 아래 버튼을 클릭해주세요.</p>
        <ul className={styles.addressModal__list}>
          {addresses.map(address => (
            <li key={address.id} className={styles.addressModal__item}>
              <span className={styles.addressModal__road}>{address.roadFull}</span>
              <button
                type="button"
                className={styles.addressModal__button}
                onClick={() => {
                  if (selectedAddress !== address.id) {
                    dispatch(setSelectedAddress(address.id));
                    onClose();
                  }
                }}
              >
                선택
              </button>
            </li>
          ))}
        </ul>
      </div>
    </ModalWrapper>
  );
};

export default PayAddressChange;
