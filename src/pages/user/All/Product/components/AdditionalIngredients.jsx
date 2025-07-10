/* eslint-disable react/function-component-definition */
import React from 'react';
import Button from '@/common/components/Button';
import styles from '../ProductPage.module.scss';
import IngredientControl from './IngredientControl';

const AdditionalIngredients = ({ ingredients, onQtyChange, onRemove, onSearch }) => (
  <div className={styles.additionalIngredients}>
    <h3>추가 식재료</h3>
    <div className={styles.searchBar}>
      <Button className={styles.searchIcon} onClick={onSearch}>
        🔍
      </Button>
      <input type="text" placeholder="식재료를 입력하세요" />
    </div>
    <div className={styles.ingredientGrid}>
      {ingredients.map((item, idx) => (
        <IngredientControl
          key={item.id || idx}
          item={item}
          onQtyChange={onQtyChange}
          onRemove={onRemove}
        />
      ))}
    </div>
  </div>
);

export default AdditionalIngredients;
