/* eslint-disable react/prop-types */
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { calculateItemTotal } from '../../../../../common/utils/cartUtils';
import useToast from '@/common/hooks/useToast';
import { deleteCartItem, editCartItemCount, toggleSelect } from '../../../../../store/cartPaySlice';
import styles from '../../CartPayPage.module.scss';
import CheckBox from '../common/CheckBox';

function CartItem({ item }) {
  const dispatch = useDispatch();
  const { showNegative, showInfo } = useToast();
  const { loading, selectedCartItemIds } = useSelector(state => state.pay);

  const navigate = useNavigate();

  // 카트 아이템 선택
  const handleSelectItem = () => {
    dispatch(toggleSelect(item.id));
  };

  // 카트 아이템 삭제
  const handleDeleteItem = () => {
    if (loading) return;
    dispatch(deleteCartItem({ id: item.id }));
    showInfo('삭제되었습니다.');
  };

  // 카트 아이템 수량 증가
  const handleIncreaseQuantity = () => {
    if (loading) return;
    dispatch(editCartItemCount({ id: item.id, count: item.quantity + 1 }));
  };

  // 카트 아이템 수량 감소
  const handleDecreaseQuantity = () => {
    if (loading) return;

    if (item.quantity > 1) {
      dispatch(editCartItemCount({ id: item.id, count: item.quantity - 1 }));
    } else {
      showNegative('1 이하로는 수량을 감소시킬 수 없습니다.');
    }
  };

  return (
    <li className={styles.cartItem}>
      {selectedCartItemIds.includes(item.id) || <div className={styles.masking} />}

      <CheckBox checked={selectedCartItemIds.includes(item.id)} onChange={handleSelectItem} />

      <img
        src={item.thumbnail}
        alt={item.cookName}
        onClick={() => navigate(`/product?id=${item.cookId}`)}
      />

      <div>
        <h3>{item.cookName}</h3>

        {/* 기본 재료 */}
        <p>
          <strong>기본 재료</strong>
          <br />
          {item.baseIngredients
            .map(ingre => {
              const totalWeight = ingre.unitQuantity * ingre.unit;
              return `${ingre.ingreName} ${totalWeight}g`;
            })
            .join(', ')}
        </p>

        {/* 추가 재료 */}
        <p>
          <strong>추가 재료</strong>
          <br />
          {item.additionalIngredients.length === 0
            ? '없음'
            : item.additionalIngredients
                .map(ingre => {
                  const totalWeight = ingre.unitQuantity * ingre.unit;
                  return `${ingre.ingreName} ${totalWeight}g`;
                })
                .join(', ')}
        </p>
      </div>

      <button type="button" className={styles.deleteButton} onClick={handleDeleteItem}>
        ✕
      </button>

      <div>
        <div>
          <button type="button" onClick={handleDecreaseQuantity}>
            -
          </button>
          <span>{item.quantity}</span>
          <button type="button" onClick={handleIncreaseQuantity}>
            +
          </button>
        </div>
        <div className={styles.price}>{calculateItemTotal(item).toLocaleString()} ₩</div>
      </div>
    </li>
  );
}
export default CartItem;
