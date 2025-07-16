/* eslint-disable react/no-array-index-key */
import React from 'react';
import PropTypes from 'prop-types';
import styles from './AdminOrderDetailModal.module.scss';

function OrderCookList({ cooks }) {
  return (
    <div className={styles.cookDetailBodyRow}>
      <span className={styles.cookDetailTitle}>주문 상품</span>
      {cooks.map((item, idx) => (
        <div key={item.cookName + idx} className={styles.cookItem}>
          <div className={styles.cookTitle}>
            {idx + 1}. {item.cookName}
          </div>
          <div className={styles.ingredientBoxWrapper}>
            <div className={styles.ingredientBox}>
              <span className={styles.ingredientTitle}>기본 식재료</span>
              <div className={styles.ingredientList}>
                {item.baseIngredients.length > 0 ? (
                  item.baseIngredients.map((ingredient, i) => (
                    <span key={`base-${ingredient}-${i}`} className={styles.ingredientBaseItem}>
                      {ingredient}
                    </span>
                  ))
                ) : (
                  <span>없음</span>
                )}
              </div>
            </div>
            <div className={styles.ingredientBox}>
              <span className={styles.ingredientTitle}>추가 식재료</span>
              <div className={styles.ingredientList}>
                {item.additionalIngredients.length > 0 ? (
                  item.additionalIngredients.map((ingredient, i) => (
                    <span key={`add-${ingredient}-${i}`} className={styles.ingredientAddItem}>
                      {ingredient}
                    </span>
                  ))
                ) : (
                  <span>없음</span>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

OrderCookList.propTypes = {
  cooks: PropTypes.arrayOf(
    PropTypes.shape({
      cookName: PropTypes.string,
      baseIngredients: PropTypes.arrayOf(PropTypes.string),
      additionalIngredients: PropTypes.arrayOf(PropTypes.string),
    })
  ).isRequired,
};

export default OrderCookList;
