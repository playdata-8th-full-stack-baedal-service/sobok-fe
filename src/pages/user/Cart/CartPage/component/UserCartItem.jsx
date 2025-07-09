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

function UserCartItem({ item }) {
  const dispatch = useDispatch();

  const { selectedItems } = useSelector(state => state.cart);

  // 카트 아이템 선택
  const handleSelectItem = () => {
    dispatch(toggleSelectItem(item.id));
  };

  // 카트 아이템 삭제
  const handleDeleteItem = () => {
    dispatch(deleteCartItem(item.id));
    dispatch(deleteItem(item.id));
  };

  // 카트 아이템 수량 증가
  const handleIncreaseQuantity = () => {
    dispatch(editCartItemCount({ id: item.id, count: item.quantity + 1 }));
    dispatch(increaseQuantity(item.id));
  };

  // 카트 아이템 수량 감소
  const handleDecreaseQuantity = () => {
    if (item.quantity > 1) {
      dispatch(editCartItemCount({ id: item.id, count: item.quantity - 1 }));
      dispatch(decreaseQuantity(item.id));
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
        <ul className={styles.ingredientList}>
          {item.ingredients.map(ingre => {
            const totalWeight = ingre.unitQuantity * ingre.unit;
            const ingredientTotal = totalWeight * ingre.price;

            return (
              <li key={ingre.ingredientId}>
                {ingre.ingreName} - {totalWeight}g / ₩{ingredientTotal.toLocaleString()}
              </li>
            );
          })}
        </ul>
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
    ingredients: PropTypes.arrayOf(
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
