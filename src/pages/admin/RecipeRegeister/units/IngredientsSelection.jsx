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
      const formattedIngredients = selectedIngredients.map(ingredient => {
        const currentUnit = parseFloat(ingredient.unit) || 0; // 현재 그램 수
        const dbUnit = parseFloat(ingredient.dbUnit) || 1; // DB 기본 단위 (그램)
        const unitQuantity = Math.round(currentUnit / dbUnit); // 몇 개의 단위인지 계산
        
        return {
          ingredientId: ingredient.id,
          unitQuantity: unitQuantity, // DB에는 단위 개수로 저장
          // 가격 계산을 위한 추가 정보
          pricePerUnit: ingredient.pricePerUnit, // 1g당 가격
          totalPrice: ingredient.totalPrice, // 총 가격
          // 디버깅용 정보
          currentGrams: currentUnit, // 현재 그램 수
          dbUnitGrams: dbUnit // DB 기본 단위 그램
        };
      });
      onIngredientsChange(formattedIngredients);
    }
  }, [selectedIngredients, onIngredientsChange]);

  // 1g당 가격을 계산하는 함수
  const calculatePricePerUnit = (originalPrice, originalUnit) => {
    const price = parseFloat(originalPrice) || 0;
    const unit = parseFloat(originalUnit) || 1;
    return price / unit; // 1g당 가격
  };

  // 총 가격을 계산하는 함수
  const calculateTotalPrice = (pricePerUnit, currentUnit) => {
    const unitValue = parseFloat(currentUnit) || 0;
    return Math.round(pricePerUnit * unitValue); // 반올림하여 정수로 반환
  };

  const handleQuantityChange = (ingredientId, quantity) => {
    setSelectedIngredients(prev =>
      prev.map(item => {
        if (item.id === ingredientId) {
          const newUnit = quantity;
          const totalPrice = calculateTotalPrice(item.pricePerUnit, newUnit);
          return { 
            ...item, 
            unit: newUnit,
            totalPrice: totalPrice
          };
        }
        return item;
      }).filter(item => parseFloat(item.unit) > 0) // unit이 0 이하면 목록에서 제거
    );
  };

  const handleIngredientSelect = ingredient => {
    const existingIngredient = selectedIngredients.find(item => item.id === ingredient.id);
    
    if (existingIngredient) {
      // 이미 선택된 경우: DB에 저장된 기본 단위만큼 추가
      const currentUnit = parseFloat(existingIngredient.unit) || 0;
      const dbUnit = parseFloat(ingredient.unit) || 10; // DB에서 가져온 기본 단위
      const newUnit = currentUnit + dbUnit;
      const totalPrice = calculateTotalPrice(existingIngredient.pricePerUnit, newUnit);
      
      setSelectedIngredients(prev =>
        prev.map(item =>
          item.id === ingredient.id
            ? { 
                ...item, 
                unit: newUnit.toString(),
                totalPrice: totalPrice
              }
            : item
        )
      );
    } else {
      // 처음 선택하는 경우: DB의 기본 단위로 초기화
      const dbUnit = parseFloat(ingredient.unit) || 10; // DB에서 가져온 기본 단위
      const originalPrice = parseFloat(ingredient.price) || 0; // API에서 받는 가격 필드명에 맞게 수정
      const pricePerUnit = calculatePricePerUnit(originalPrice, dbUnit);
      const totalPrice = calculateTotalPrice(pricePerUnit, dbUnit);
      
      setSelectedIngredients(prev => [
        ...prev, 
        { 
          ...ingredient, 
          unit: dbUnit.toString(), // DB 기본 단위로 설정
          dbUnit: dbUnit, // DB 기본 단위 저장 (증가/감소 시 사용)
          originalPrice: originalPrice, // 원본 가격 저장
          pricePerUnit: pricePerUnit, // 1g당 가격
          totalPrice: totalPrice // 총 가격
        }
      ]);
    }
  };

  // 감소 기능을 위한 함수 수정
  const handleDecreaseIngredient = ingredientId => {
    setSelectedIngredients(prev =>
      prev.map(item => {
        if (item.id === ingredientId) {
          const currentUnit = parseFloat(item.unit) || 0;
          const dbUnit = parseFloat(item.dbUnit) || 10; // DB 기본 단위 사용
          const newUnit = Math.max(0, currentUnit - dbUnit);
          const totalPrice = calculateTotalPrice(item.pricePerUnit, newUnit);
          return { 
            ...item, 
            unit: newUnit.toString(),
            totalPrice: totalPrice
          };
        }
        return item;
      }).filter(item => parseFloat(item.unit) > 0) // 0이 되면 목록에서 제거
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
                  <span className={style.priceInfo}>
                    {ingredient.totalPrice}원 (1g당 {ingredient.pricePerUnit.toFixed(1)}원)
                  </span>
                  <span className={style.unitInfo}>
                    단위 개수: {Math.round(parseFloat(ingredient.unit) / parseFloat(ingredient.dbUnit))}개
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