/* eslint-disable react/function-component-definition */
import React, { useEffect, useState } from 'react';
import styles from './ProductPage.module.scss';
import ProductImage from './components/ProductImage';
import ProductInfo from './components/ProductInfo';
import BaseIngredients from './components/BaseIngredients';
import AdditionalIngredients from './components/AdditionalIngredients';

const ProductPage = () => {
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [portion, setPortion] = useState(1);
  const [baseIngredients, setBaseIngredients] = useState([
    { id: 1, name: '대파', qty: '20g' },
    { id: 2, name: '양파', qty: '30g' },
    { id: 3, name: '고추', qty: '10g' },
  ]);
  const [additionalIngredients, setAdditionalIngredients] = useState([
    { id: 101, name: '계란', qty: 1 },
    { id: 102, name: '치즈', qty: 2 },
  ]);

  useEffect(() => {
    setThumbnailUrl('https://picsum.photos/200/300');
  }, []);

  const handleRecipeClick = () => {};
  const handlePayClick = () => {};
  const handleCartClick = () => {};
  const handlePortionChange = value => {
    if (value < 1) return;
    setPortion(value);
  };
  const handleQtyChange = (id, value) => {
    setAdditionalIngredients(prev =>
      prev.map(item => (item.id === id ? { ...item, qty: value < 1 ? 1 : value } : item))
    );
  };
  const handleRemove = id => {
    setAdditionalIngredients(prev => prev.filter(item => item.id !== id));
  };
  const handleSearch = () => {};

  return (
    <div className={styles.productPage}>
      <header className={styles.productHeader}>
        <ProductImage thumbnailUrl={thumbnailUrl} />
        <ProductInfo
          name="음식 이름"
          basePrice={13000}
          category="# 카테고리"
          warning="돼지고기, 간장(대두), 굴소스(굴), 생면(밀)"
          onRecipeClick={handleRecipeClick}
          onPayClick={handlePayClick}
          onCartClick={handleCartClick}
        />
      </header>
      <BaseIngredients
        ingredients={baseIngredients}
        portion={portion}
        onPortionChange={handlePortionChange}
      />
      <AdditionalIngredients
        ingredients={additionalIngredients}
        onQtyChange={handleQtyChange}
        onRemove={handleRemove}
        onSearch={handleSearch}
      />
    </div>
  );
};

export default ProductPage;
