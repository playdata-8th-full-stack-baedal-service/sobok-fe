/* eslint-disable react/function-component-definition */
import React, { useEffect, useState } from 'react';
import styles from './ProductPage.module.scss';
import Button from '../../../../common/components/Button';

const ProductPage = () => {
  const [thumbnailUrl, setThumbnailUrl] = useState('');

  useEffect(() => {
    setThumbnailUrl('https://picsum.photos/200/300');
  }, []);

  const handleThumbnailClick = () => {
    setThumbnailUrl('https://picsum.photos/200/300');
  };

  const handleRecipeClick = () => {
    setThumbnailUrl('https://picsum.photos/200/300');
  };

  const handlePayClick = () => {
    setThumbnailUrl('https://picsum.photos/200/300');
  };

  const handleCartClick = () => {
    setThumbnailUrl('https://picsum.photos/200/300');
  };

  const handleQtyChange = (idx, value) => {
    setThumbnailUrl('https://picsum.photos/200/300');
  };

  const handleRemove = idx => {
    setThumbnailUrl('https://picsum.photos/200/300');
  };
  return (
    <div className={styles.productPage}>
      <header className={styles.productHeader}>
        <img src={thumbnailUrl} alt="음식 이미지" className={styles.productImage} />

        <div className={styles.productInfo}>
          <div className={styles.productTop}>
            <h2 className={styles.productName}>음식 이름</h2>
            <p className={styles.productBasePrice}>기본 레시피 : 13,000 원</p>
            <Button className={styles.productFavorite}>★</Button>
          </div>

          <span className={styles.productCategory}># 카테고리</span>

          <p className={styles.productWarning}>
            알레르기 유발 물질 안내
            <br />
            <small>돼지고기, 간장(대두), 굴소스(굴), 생면(밀)</small>
            <br />
          </p>

          <div className={styles.productActions}>
            <Button className={styles.recipeButton} onClick={handleRecipeClick}>
              레시피 보기
            </Button>
            <p className={styles.totalPrice}>24,000 원</p>
            <Button className={styles.payButton} onClick={handlePayClick}>
              결제 하기
            </Button>
            <Button className={styles.cartButton} onClick={handleCartClick}>
              장바구니 담기
            </Button>
          </div>
        </div>
      </header>

      <section className={styles.baseIngredients}>
        <div className={styles.sectionHeader}>
          <h3>기본 식재료</h3>
          <div className={styles.portionControl}>
            <Button>-</Button>
            <span> 1 인분 </span>
            <Button>+</Button>
          </div>
        </div>

        <div className={styles.ingredientGrid}>
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className={styles.ingredientItem}>
              대파 20g
            </div>
          ))}
        </div>
      </section>

      <div className={styles.additionalIngredients}>
        <h3>추가 식재료</h3>

        <div className={styles.searchBar}>
          <Button className={styles.searchIcon}>🔍</Button>
          <input type="text" placeholder="식재료를 입력하세요" />
        </div>

        <div className={styles.ingredientGrid}>
          {/* {additionalIngredients.map((item, idx) => ( */}
          {Array.from({ length: 8 }).map((item, idx) => (
            <div className={styles.ingredientControl}>
              <span className={styles.ingredientName}>대파</span>

              <div className={styles.quantityControl}>
                <Button className={styles.qtyButton}>-</Button>
                <span className={styles.ingredientQty}>20g</span>
                <Button className={styles.qtyButton}>+</Button>
              </div>

              <Button className={styles.removeButton}>×</Button>
            </div>
          ))}
        </div>
      </div>

      {/* 추천 식재료 영역 */}
      {/* <section className="relatedProducts">
        <div className="relatedHeader">
          <h3>추천 식재료</h3>
          <button type="button" className="moreButton">더보기</button>
        </div>
        <div className="relatedList">
          {[1, 2, 3].map((_, i) => (
            <div key={i} className="relatedItem">
              썸네일
            </div>
          ))}
        </div>
      </section> */}
    </div>
  );
};

export default ProductPage;
