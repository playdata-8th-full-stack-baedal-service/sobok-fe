import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import style from '../RecipeRegistPage.module.scss';
import SearchInput from './SearchInput';
import { setAdditionalIngredients } from '@/store/productSlice';

/**
 * IngredientsSelection
 * - Redux 상태(product.additionalIngredients)를 직접 사용
 * - 선택된 재료 목록, 수량 변경, 삭제 기능
 */
function IngredientsSelection({ onIngredientsChange }) {
  const dispatch = useDispatch();

  // Redux에서 선택된 재료 목록 가져오기
  const selectedIngredients = useSelector(state => state.product.additionalIngredients);

  // 선택된 재료가 변경될 때 부모 컴포넌트에 전달
  useEffect(() => {
    if (onIngredientsChange) {
      const formattedIngredients = selectedIngredients.map(ingredient => {
        const currentUnit = parseFloat(ingredient.unit) || 0;
        const dbUnit = parseFloat(ingredient.dbUnit) || 1;
        const unitQuantity = Math.round(currentUnit / dbUnit);

        return {
          ingredientId: ingredient.id,
          unitQuantity,
          pricePerUnit: ingredient.pricePerUnit,
          totalPrice: ingredient.totalPrice,
        };
      });
      onIngredientsChange(formattedIngredients);
    }
  }, [selectedIngredients, onIngredientsChange]);

  // 수량 변경
  const handleQuantityChange = (ingredientId, quantity) => {
    const updated = selectedIngredients
      .map(item => {
        if (item.id === ingredientId) {
          const dbUnit = parseFloat(item.dbUnit) || 1;
          let newUnit = Math.round((parseFloat(quantity) || 0) / dbUnit) * dbUnit;
          if (newUnit < 0) newUnit = 0;

          return { ...item, unit: newUnit };
        }
        return item;
      })
      .filter(item => parseFloat(item.unit) > 0);

    dispatch(setAdditionalIngredients(updated));
  };

  // 재료 삭제
  const handleRemoveIngredient = ingredientId => {
    const updated = selectedIngredients.filter(item => item.id !== ingredientId);
    dispatch(setAdditionalIngredients(updated));
  };

  // 총 가격 계산
  const calculateTotalSumPrice = () => {
    return selectedIngredients.reduce((sum, ingredient) => sum + (ingredient.totalPrice || 0), 0);
  };

  return (
    <div className={style.IngredientsSelection}>
      <div className={style.newingredientselection}>
        <p className={style.ingretitle}>기본 식재료 등록</p>
        {/* 기존 SearchInput 그대로 사용 */}
        <SearchInput placeholder="검색어를 입력하세요." />
      </div>

      <div className={style.ingredientlist}>
        <div className={style.titlezone}>
          <h3 className={style.ingretitletwo}>선택한 식재료 목록</h3>
          <h4>총 가격: {calculateTotalSumPrice().toLocaleString()}원</h4>
        </div>

        {selectedIngredients.length === 0 ? (
          <p>검색을 통해 식재료를 선택해주세요.</p>
        ) : (
          <div className={style.ingredientsList}>
            {selectedIngredients.map(ingredient => (
              <div key={ingredient.id} className={style.ingredientListItem}>
                <div className={style.ingredientInfo}>
                  <span className={style.ingredientName}>{ingredient.ingreName}</span>
                  <span className={style.priceInfo}>
                    {ingredient.totalPrice?.toLocaleString() || 0}원 (1g당{' '}
                    {ingredient.pricePerUnit?.toFixed(0) || 0}원)
                  </span>
                  <span className={style.unitInfo}>
                    개수:{' '}
                    {Math.round(
                      (parseFloat(ingredient.unit) || 0) / (parseFloat(ingredient.dbUnit) || 1)
                    )}
                    개 ({ingredient.unit}g)
                  </span>
                </div>
                <div className={style.quantityControl}>
                  <div className={style.quantityWrapper}>
                    <input
                      type="number"
                      min="0"
                      value={ingredient.unit}
                      onChange={e => handleQuantityChange(ingredient.id, e.target.value)}
                      className={style.quantityInput}
                      step={parseFloat(ingredient.dbUnit) || 1}
                    />
                    <span className={style.unitLabel}>g</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveIngredient(ingredient.id)}
                    className={style.removeButton}
                  >
                    삭제
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default IngredientsSelection;
