/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable react/function-component-definition */
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styles from '../../CartPayPage.module.scss';
import { deleteAllCartItem, updateSelectedCartItems } from '../../../../../store/cartPaySlice';
import CheckBox from '../common/CheckBox';
import Button from '../../../../../common/components/Button';

const CartAllSelect = () => {
  const dispatch = useDispatch();
  const { selectedCartItemIds, cartItems } = useSelector(state => state.pay);

  const handleAllDelete = () => {
    dispatch(deleteAllCartItem({ selectedIds: selectedCartItemIds }));
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative' }}>
      <div className={styles.cartAllSelect}>
        <CheckBox
          checked={selectedCartItemIds.length === cartItems.length}
          onChange={() => {
            return selectedCartItemIds.length !== cartItems.length
              ? dispatch(updateSelectedCartItems(cartItems.map(i => i.id)))
              : dispatch(updateSelectedCartItems([]));
          }}
        />
        <span>
          전체 선택 ({selectedCartItemIds.length} / {cartItems.length})
        </span>
      </div>
      <div className={styles.deleteButton} onClick={handleAllDelete}>
        <span>선택 항목 취소 </span>
        <span>✕</span>
      </div>
    </div>
  );
};

export default CartAllSelect;
