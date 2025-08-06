// pages/user/Product/components/AdditionalIngredients.jsx
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styles from '../ProductPage.module.scss';
import IngredientControl from './IngredientControl';
import IngredientSearchInput from '@/common/forms/IngredientsSearch/IngredientSearchInput';
import { setAdditionalIngredients } from '@/store/productSlice';

/**
 * 사용자 상품 상세 페이지 "추가 식재료" 컴포넌트
 * - 같은 재료 선택 시 수량 증가
 * - Redux에서 선택된 재료 관리
 */
const AdditionalIngredients = () => {
  const dispatch = useDispatch();
  const { additionalIngredients } = useSelector(state => state.product);

  // 재료 선택 시 수량 증가 or 새로 추가
  const handleSelect = item => {
    const existing = additionalIngredients.find(ingredient => ingredient.id === item.id);
    const dbUnit = parseFloat(item.unit) || 1;

    if (existing) {
      const updated = additionalIngredients.map(ingredient =>
        ingredient.id === item.id
          ? { ...ingredient, quantity: ingredient.quantity + dbUnit }
          : ingredient
      );
      dispatch(setAdditionalIngredients(updated));
    } else {
      dispatch(
        setAdditionalIngredients([
          ...additionalIngredients,
          { ...item, quantity: dbUnit }, // 처음 담을 때도 DB unit 적용
        ])
      );
    }
  };

  return (
    <div className={styles.additionalIngredients}>
      <h3>
        <strong>추가 식재료</strong>
      </h3>
      <h3>추가 식재료는 1인분 기준으로 추가해주세요.</h3>
      {/* 공통 검색 인풋 */}
      <IngredientSearchInput placeholder="식재료를 입력하세요" onSelect={handleSelect} />
      {/* 선택된 재료 목록 */}
      <div className={styles.ingredientGrid}>
        {additionalIngredients.map(item => (
          <IngredientControl key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
};

export default AdditionalIngredients;
