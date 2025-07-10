/* eslint-disable react/function-component-definition */
import React from 'react';
import styles from '../ProductPage.module.scss';
import Button from '../../../../../common/components/Button';

const IngredientControl = ({ item, onQtyChange, onRemove }) => (
  <div className={styles.ingredientControl}>
    <span className={styles.ingredientName}>{item.name}</span>
    <div className={styles.quantityControl}>
      <Button className={styles.qtyButton} onClick={() => onQtyChange(item.id, item.qty - 1)}>
        -
      </Button>
      <span className={styles.ingredientQty}>{item.qty}</span>
      <Button className={styles.qtyButton} onClick={() => onQtyChange(item.id, item.qty + 1)}>
        +
      </Button>
    </div>
    <Button className={styles.removeButton} onClick={() => onRemove(item.id)}>
      ×
    </Button>
  </div>
);

export default IngredientControl;
