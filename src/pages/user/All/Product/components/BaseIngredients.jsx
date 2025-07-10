/* eslint-disable react/function-component-definition */
import React from 'react';
import Button from '@/common/components/Button';
import styles from '../ProductPage.module.scss';

const BaseIngredients = ({ ingredients, portion, onPortionChange }) => (
  <section className={styles.baseIngredients}>
    <div className={styles.sectionHeader}>
      <h3>기본 식재료</h3>
      <div className={styles.portionControl}>
        <Button onClick={() => onPortionChange(portion - 1)}>-</Button>
        <span>{portion} 인분</span>
        <Button onClick={() => onPortionChange(portion + 1)}>+</Button>
      </div>
    </div>
    <div className={styles.ingredientGrid}>
      {ingredients.map((item, i) => (
        <div key={item.id || i} className={styles.ingredientItem}>
          {item.name} {item.qty}
        </div>
      ))}
    </div>
  </section>
);

export default BaseIngredients;
