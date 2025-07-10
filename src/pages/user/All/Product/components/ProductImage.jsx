import React from 'react';
import styles from '../ProductPage.module.scss';

const ProductImage = ({ thumbnailUrl }) => (
  <img src={thumbnailUrl} alt="음식 이미지" className={styles.productImage} />
);

export default ProductImage;
