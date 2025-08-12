import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Button from '@/common/components/Button';
import styles from '../ProductPage.module.scss';
import { setPortion } from '../../../../../store/productSlice';

const BaseIngredients = () => {
  const { product, portion } = useSelector(state => state.product);
  const dispatch = useDispatch();

  const fmt = n => (Number(n) || 0).toLocaleString('ko-KR');

  return (
    <section className={styles.baseIngredients}>
      <div className={styles.sectionHeader}>
        <h3>기본 식재료</h3>
        <div className={styles.portionControl}>
          <Button onClick={() => dispatch(setPortion(portion > 1 ? portion - 1 : 1))}>-</Button>
          <span>{portion} 인분</span>
          <Button onClick={() => dispatch(setPortion(portion + 1))}>+</Button>
        </div>
      </div>
      <div className={styles.ingredientGrid}>
        {product?.ingredientList.map((item, i) => {
          const totalGram =
            (Number(item.unitQuantity) || 0) * (Number(item.unit) || 0) * (Number(portion) || 0);
          return (
            <div key={item.id || i} className={styles.ingredientItem}>
              {item.ingredientName} {fmt(totalGram)} g
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default BaseIngredients;
