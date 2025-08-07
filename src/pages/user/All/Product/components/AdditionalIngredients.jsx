import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styles from './AdditionalIngredients.module.scss';
import IngredientSearchInput from '@/common/forms/IngredientsSearch/IngredientSearchInput';
import { setAdditionalIngredients } from '@/store/productSlice';

const AdditionalIngredients = () => {
  const dispatch = useDispatch();
  const { additionalIngredients } = useSelector(state => state.product);
  const [forceOpen] = useState(true);
  const scrollRef = useRef(null);

  const handleSelect = item => {
    const existing = additionalIngredients.find(i => i.id === item.id);
    const dbUnit = parseFloat(item.unit) || 1;

    if (existing) {
      const updated = additionalIngredients.map(i =>
        i.id === item.id ? { ...i, quantity: i.quantity + dbUnit } : i
      );
      dispatch(setAdditionalIngredients(updated));
    } else {
      dispatch(setAdditionalIngredients([...additionalIngredients, { ...item, quantity: dbUnit }]));
    }
  };

  const handleQtyChange = (id, qty) => {
    const updated = additionalIngredients.map(i =>
      i.id === id ? { ...i, quantity: Math.max(Number(qty), 1) } : i
    );
    dispatch(setAdditionalIngredients(updated));
  };

  const handleRemove = id => {
    const updated = additionalIngredients.filter(i => i.id !== id);
    dispatch(setAdditionalIngredients(updated));
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [additionalIngredients]);

  return (
    <div className={styles.additionalIngredientsWrapper}>
      <div className={styles.leftSection}>
        <h3>추가 식재료</h3>
        <IngredientSearchInput
          placeholder="식재료를 입력하세요"
          onSelect={handleSelect}
          forceOpen={false}
          closeOnSelect={false}
        />
      </div>

      <div className={styles.rightSection} ref={scrollRef}>
        {additionalIngredients.length === 0 ? (
          <div className={styles.emptyMessage}>추가 식재료가 없습니다.</div>
        ) : (
          additionalIngredients.map(item => (
            <div className={styles.ingredientItem} key={item.id}>
              <span className={styles.name}>{item.ingreName}</span>
              <div className={styles.qtyControl}>
                <input
                  type="number"
                  value={item.quantity}
                  onChange={e => handleQtyChange(item.id, e.target.value)}
                  step={item.unit || 1}
                />
                <span>g</span>
              </div>
              <span className={styles.priceInfo}>/{item.price}원</span>
              <span className={styles.totalPrice}>{item.price * item.quantity}원</span>
              <button className={styles.removeBtn} onClick={() => handleRemove(item.id)}>
                ×
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdditionalIngredients;
