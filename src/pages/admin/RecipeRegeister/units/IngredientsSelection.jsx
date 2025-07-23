import React, { useState, useEffect } from 'react';
import axios from 'axios';
import style from '../RecipeRegistPage.module.scss';
import SearchInput from './SearchInput';
import { API_BASE_URL } from '../../../../services/host-config';

function IngredientsSelection({ formData, onChange, onIngredientsChange, resetSignal }) {
  const [ingredients, setIngredients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedIngredients, setSelectedIngredients] = useState([]);

  const allIngredients = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/cook-service/ingredient/all-search`);
      console.log(response.data);
      if (response.data.success) {
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

  useEffect(() => {
    setSelectedIngredients([]);
  }, [resetSignal]);

  // 선택된 식재료가 변경될 때마다 부모 컴포넌트에 알림
  useEffect(() => {
    if (onIngredientsChange) {
      const formattedIngredients = selectedIngredients.map(ingredient => ({
        ingredientId: ingredient.id,
        unitQuantity: parseInt(ingredient.unit, 10) || 0,
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
    const existingIngredient = selectedIngredients.find(item => item.id === ingredient.id);
    
    if (existingIngredient) {
      // 이미 선택된 경우: 저장된 원본 unit 값만큼 추가
      const currentUnit = parseInt(existingIngredient.unit, 10) || 0;
      const originalUnit = parseInt(existingIngredient.originalUnit, 10) || 10;
      
      setSelectedIngredients(prev =>
        prev.map(item =>
          item.id === ingredient.id
            ? { ...item, unit: (currentUnit + originalUnit).toString() }
            : item
        )
      );
    } else {
      // 처음 선택하는 경우: 원본 unit 값으로 초기화하고 originalUnit 저장
      const originalUnit = ingredient.unit || '10';
      setSelectedIngredients(prev => [
        ...prev, 
        { 
          ...ingredient, 
          unit: originalUnit,
          originalUnit: originalUnit // 원본 unit 값 저장
        }
      ]);
    }
  };

  // 감소 기능을 위한 함수 추가
  const handleDecreaseIngredient = ingredientId => {
    setSelectedIngredients(prev =>
      prev.map(item => {
        if (item.id === ingredientId) {
          const currentUnit = parseInt(item.unit, 10) || 0;
          const originalUnit = parseInt(item.originalUnit, 10) || 10;
          const newUnit = Math.max(0, currentUnit - originalUnit);
          return { ...item, unit: newUnit.toString() };
        }
        return item;
      }).filter(item => parseInt(item.unit, 10) > 0) // 0이 되면 목록에서 제거
    );
  };

  const handleRemoveIngredient = ingredientId => {
    setSelectedIngredients(prev => prev.filter(item => item.id !== ingredientId));
  };

  return (
    <div className={style.IngredientsSelection}>
      <div className={style.newingredientselection}>
        <p className={style.ingretitle}>기본 식재료 등록</p>
        <SearchInput
          placeholder="검색어를 입력하세요."
          onIngredientAdded={allIngredients}
          onIngredientSelect={handleIngredientSelect}
          resetSignal={resetSignal}
        />
      </div>

      <div className={style.ingredientlist}>
        <h3 className={style.ingretitletwo}>선택한 식재료 목록</h3>
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
                      step={parseInt(ingredient.originalUnit, 10) || 1}
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