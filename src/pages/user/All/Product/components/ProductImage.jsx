/* eslint-disable react/function-component-definition */
import React from 'react';
import { useSelector } from 'react-redux';
import styles from '../ProductPage.module.scss';

const ProductImage = () => {
  const { product } = useSelector(state => state.product);

  return (
    <img
      src={product?.thumbnail}
      alt="음식 이미지"
      className={styles.productImage}
      onError={e => {
        e.currentTarget.onerror = null;
        e.currentTarget.src = './soboklogo.png';
      }}
    />
  );
};

export default ProductImage;
