import React from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import {
  toggleSelectItem,
  deleteItem,
  decreaseQuantity,
  increaseQuantity,
  editCartItemCount,
  deleteCartItem,
} from '../../../../../store/cartSlice';
import { calculateItemTotal } from '../../../../../common/utils/cartUtils';
import styles from './UserCartItem.module.scss';
import useToast from '@/common/hooks/useToast';

function UserCartItem({ item }) {
  const dispatch = useDispatch();
  const { showSuccess, showNegative, showInfo } = useToast();

  const { selectedItems, totalPrice } = useSelector(state => state.cart);

  // 카트 아이템 선택
  const handleSelectItem = () => {
    dispatch(toggleSelectItem(item.id));
  };

  // 카트 아이템 삭제
  const handleDeleteItem = () => {
    dispatch(deleteItem(item.id));
    dispatch(deleteCartItem({ id: item.id, totalPrice, selectedItems }));
    showInfo('삭제되었습니다.');
  };

  // 카트 아이템 수량 증가
  const handleIncreaseQuantity = () => {
    dispatch(increaseQuantity(item.id));
    dispatch(
      editCartItemCount({ id: item.id, count: item.quantity + 1, totalPrice, selectedItems })
    );
  };

  // 카트 아이템 수량 감소
  const handleDecreaseQuantity = () => {
    if (item.quantity > 1) {
      dispatch(decreaseQuantity(item.id));
      dispatch(
        editCartItemCount({ id: item.id, count: item.quantity - 1, totalPrice, selectedItems })
      );
    }
  };

  // 카트 아이템 수량 수정
  // useEffect(() => {
  //   if (selectedItems.includes(item.id)) {
  //     dispatch(editCartItemCount({ id: item.id, count: item.quantity }));
  //   }
  // }, [item.id, item.quantity, dispatch]);

  return (
    <li className={`${styles.cartItem} ${selectedItems.includes(item.id) ? styles.selected : ''}`}>
      <input
        type="checkbox"
        className={styles.checkbox}
        checked={selectedItems.includes(item.id)}
        onChange={handleSelectItem}
      />

      <img src={item.thumbnail} alt={item.cookName} className={styles.thumbnail} />

      <div className={styles.content}>
        <h3 className={styles.cookName}>{item.cookName}</h3>

        {/* 기본 재료 */}
        <p className={styles.ingredientSummary}>
          <strong>기본 재료:</strong>{' '}
          {item.baseIngredients
            .map(ingre => {
              const totalWeight = ingre.unitQuantity * ingre.unit;
              return `${ingre.ingreName} ${totalWeight}g`;
            })
            .join(', ')}
        </p>

        {/* 추가 재료 */}
        <p className={styles.ingredientSummary}>
          <strong>추가 재료:</strong>{' '}
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

      <button type="button" onClick={handleDeleteItem} className={styles.deleteButton}>
        ✕
      </button>

      <div className={styles.controls}>
        <div className={styles.quantityControl}>
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

UserCartItem.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.number.isRequired,
    cookName: PropTypes.string.isRequired,
    thumbnail: PropTypes.string.isRequired,
    quantity: PropTypes.number.isRequired,
    baseIngredients: PropTypes.arrayOf(
      PropTypes.shape({
        ingredientId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        ingreName: PropTypes.string.isRequired,
        unitQuantity: PropTypes.number.isRequired,
        unit: PropTypes.string.isRequired,
        price: PropTypes.number.isRequired,
        origin: PropTypes.string,
      })
    ).isRequired,
    additionalIngredients: PropTypes.arrayOf(
      PropTypes.shape({
        ingredientId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        ingreName: PropTypes.string.isRequired,
        unitQuantity: PropTypes.number.isRequired,
        unit: PropTypes.string.isRequired,
        price: PropTypes.number.isRequired,
        origin: PropTypes.string,
      })
    ).isRequired,
  }).isRequired,
};

export default UserCartItem;
