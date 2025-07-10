/* eslint-disable react/function-component-definition */
import React from 'react';
import Button from '../../../../../common/components/Button';
import styles from '../ProductPage.module.scss';

const ProductInfo = ({
  name,
  basePrice,
  category,
  warning,
  onRecipeClick,
  onPayClick,
  onCartClick,
}) => (
  <div className={styles.productInfo}>
    <div className={styles.productTop}>
      <h2 className={styles.productName}>{name}</h2>
      <p className={styles.productBasePrice}>기본 레시피 : {basePrice.toLocaleString()} 원</p>
      <Button className={styles.productFavorite}>★</Button>
    </div>
    <span className={styles.productCategory}>{category}</span>
    <p className={styles.productWarning}>
      알레르기 유발 물질 안내
      <br />
      <small>{warning}</small>
      <br />
    </p>
    <div className={styles.productActions}>
      <Button className={styles.recipeButton} onClick={onRecipeClick}>
        레시피 보기
      </Button>
      <p className={styles.totalPrice}>24,000 원</p>
      <Button className={styles.payButton} onClick={onPayClick}>
        결제 하기
      </Button>
      <Button className={styles.cartButton} onClick={onCartClick}>
        장바구니 담기
      </Button>
    </div>
  </div>
);

export default ProductInfo;
