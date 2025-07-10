import React, { useState, useEffect } from 'react';
import style from '../RecipeRegistPage.module.scss';
import SearchInput from './SearchInput';
import axiosInstance from '../../../../services/axios-config';

function IngredientsSelection({ formData, onChange, onIngredientsChange }) {
  const [ingredients, setIngredients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedIngredients, setSelectedIngredients] = useState([]);

  const allIngredients = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/ingredient/all-search');
      console.log(response.data);
      if (response.data.success && Array.isArray(response.data.data)) {
        setIngredients(response.data.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    allIngredients();
  }, []);

  // 선택된 식재료가 변경될 때마다 부모 컴포넌트에 알림
  useEffect(() => {
    if (onIngredientsChange) {
      const formattedIngredients = selectedIngredients.map(ingredient => ({
        ingredientId: ingredient.id,
        unitQuantity: parseInt(ingredient.unit) || 0,
      }));
      onIngredientsChange(formattedIngredients);
    }
  }, [selectedIngredients, onIngredientsChange]);

  const handleQuantityChange = (ingredientId, quantity) => {
    setSelectedIngredients(prev =>
      prev.map(item => (item.id === ingredientId ? { ...item, unit: quantity } : item))
    );
  };

  const handleIngredientSelect = ingredient => {
    // 이미 선택된 식재료인지 확인
    const existingIngredient = selectedIngredients.find(item => item.id === ingredient.id);
    if (existingIngredient) {
      // 이미 선택된 경우 기존 수량에 해당 식재료의 unit 값만큼 추가
      const currentUnit = parseInt(existingIngredient.unit) || 0;
      const ingredientUnit = parseInt(ingredient.unit) || 10;
      setSelectedIngredients(prev =>
        prev.map(item =>
          item.id === ingredient.id
            ? { ...item, unit: (currentUnit + ingredientUnit).toString() }
            : item
        )
      );
    } else {
      // 새로 선택하는 경우 기본값으로 추가
      setSelectedIngredients(prev => [...prev, { ...ingredient, unit: ingredient.unit || '10' }]);
    }
  };

  const handleRemoveIngredient = ingredientId => {
    setSelectedIngredients(prev => prev.filter(item => item.id !== ingredientId));
  };

  return (
    <div className={style.IngredientsSelection}>
      <div className={style.newingredientselection}>
        <p>기본 식재료 등록</p>
        <SearchInput
          placeholder="검색어를 입력하세요."
          onIngredientAdded={allIngredients}
          onIngredientSelect={handleIngredientSelect}
        />
      </div>

      <div className={style.ingredientlist}>
        <h3>선택한 식재료 목록</h3>
        {selectedIngredients.length === 0 ? (
          <p>검색을 통해 식재료를 선택해주세요.</p>
        ) : (
          <div className={style.ingredientsList}>
            {selectedIngredients.map(ingredient => (
              <div key={ingredient.id} className={style.ingredientListItem}>
                <div className={style.ingredientInfo}>
                  <span className={style.ingredientName}>{ingredient.ingreName}</span>
                </div>
                <div className={style.quantityControl}>
                  <div className={style.quantityWrapper}>
                    <input
                      type="number"
                      min="0"
                      value={ingredient.unit}
                      onChange={e => handleQuantityChange(ingredient.id, e.target.value)}
                      className={style.quantityInput}
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
