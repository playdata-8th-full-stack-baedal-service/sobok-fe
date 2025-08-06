import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axiosInstance from '@/services/axios-config';
import { openModal } from '@/store/modalSlice';
import IngredientSearchInput from '@/common/forms/IngredientsSearch/IngredientSearchInput';
import { setAdditionalIngredients } from '@/store/productSlice';
import styles from '../RecipeRegistPage.module.scss';

const SearchInput = ({ onIngredientSelect }) => {
  const dispatch = useDispatch();
  const additionalIngredients = useSelector(state => state.product.additionalIngredients);

  // 가격 계산 함수
  const calculatePricePerUnit = price => parseFloat(price) || 0;
  const calculateTotalPrice = (pricePerUnit, unit) =>
    Math.round(pricePerUnit * (parseFloat(unit) || 0));

  // 재료 선택 시 실행
  const handleSelect = item => {
    if (onIngredientSelect) {
      onIngredientSelect(item); // 관리자용 콜백 실행
    }
    const existing = additionalIngredients.find(ingredient => ingredient.id === item.id);

    if (existing) {
      // 이미 선택된 재료 → 수량 증가
      const dbUnit = parseFloat(item.unit) || 1;
      const updated = additionalIngredients.map(ingredient => {
        if (ingredient.id === item.id) {
          const newQuantity = ingredient.quantity + dbUnit;
          const totalPrice = calculateTotalPrice(ingredient.pricePerUnit, newQuantity);
          return {
            ...ingredient,
            quantity: newQuantity,
            totalPrice,
          };
        }
        return ingredient;
      });
      dispatch(setAdditionalIngredients(updated));
    } else {
      // 새 재료 추가
      const dbUnit = parseFloat(item.unit) || 1;
      const pricePerUnit = calculatePricePerUnit(item.price);
      const totalPrice = calculateTotalPrice(pricePerUnit, dbUnit);

      dispatch(
        setAdditionalIngredients([
          ...additionalIngredients,
          {
            ...item,
            quantity: dbUnit,
            dbUnit,
            pricePerUnit,
            totalPrice,
            unit: dbUnit, // g 단위 값 저장
          },
        ])
      );
    }
  };

  // 식재료 추가 버튼 클릭 시 모달 열기
  const handleAddIngredient = newName => {
    dispatch(
      openModal({
        type: 'INGREDIENT_REGISTER',
        props: {
          initialIngreName: newName,
          onSuccess: async addedName => {
            try {
              const res = await axiosInstance.get(
                `/cook-service/ingredient/keyword-search?keyword=${addedName}`
              );
              if (res.data.success && res.data.data.length > 0) {
                handleSelect(res.data.data[0]);
              }
            } catch (err) {
              console.error('등록 후 재조회 실패:', err);
            }
          },
        },
      })
    );
  };

  return (
    <IngredientSearchInput
      placeholder="검색어를 입력하세요."
      onSelect={handleSelect}
      showAddButton
      onAddIngredient={handleAddIngredient}
      closeOnSelect={true}
    />
  );
};

export default SearchInput;
