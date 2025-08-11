import React, { useState, useEffect, useRef } from 'react';
import axiosInstance from '@/services/axios-config';
import style from '../RecipeRegistPage.module.scss';
import SearchInput from './SearchInput';
import { API_BASE_URL } from '@/services/host-config';

const HOLD_START_DELAY = 300; // 길게 누르기 시작 지연(ms)
const HOLD_INTERVAL = 70; // 반복 간격(ms)

function IngredientsSelection({ formData, onChange, onIngredientsChange, resetSignal }) {
  const [ingredients, setIngredients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedIngredients, setSelectedIngredients] = useState([]);

  // hold 타이머
  const holdTimeoutRef = useRef(null);
  const holdIntervalRef = useRef(null);

  const clearTimers = () => {
    if (holdTimeoutRef.current) {
      clearTimeout(holdTimeoutRef.current);
      holdTimeoutRef.current = null;
    }
    if (holdIntervalRef.current) {
      clearInterval(holdIntervalRef.current);
      holdIntervalRef.current = null;
    }
  };

  // 전체 식재료 불러오기
  const allIngredients = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(
        `${API_BASE_URL}/cook-service/ingredient/all-search`
      );
      if (response.data.success) {
        setIngredients(response.data.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // 컴포넌트 마운트 시 전체 식재료 불러오기
  useEffect(() => {
    allIngredients();
  }, []);

  // resetSignal 변경 시 선택된 식재료 초기화
  useEffect(() => {
    setSelectedIngredients([]);
  }, [resetSignal]);

  // 총 가격 계산
  const calculateTotalSumPrice = () => {
    return selectedIngredients.reduce((sum, ingredient) => {
      return sum + (parseFloat(ingredient.totalPrice) || 0);
    }, 0);
  };

  // 선택된 식재료 변경 시 부모에 전달
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
          currentGrams: currentUnit,
          dbUnitGrams: dbUnit,
        };
      });
      onIngredientsChange(formattedIngredients);
    }
  }, [selectedIngredients, onIngredientsChange]);

  const calculatePricePerUnit = originalPrice => {
    return parseFloat(originalPrice) || 0;
  };

  const calculateTotalPrice = (pricePerUnit, currentUnit) => {
    const unitValue = parseFloat(currentUnit) || 0;
    return Math.round(pricePerUnit * unitValue);
  };

  // 단위(step) 증감 전용 핸들러: +1/-1 step
  const stepChange = (ingredientId, delta /* +1 또는 -1 */) => {
    setSelectedIngredients(prev => {
      const next = prev.flatMap(item => {
        if (item.id !== ingredientId) return [item];
        const dbUnit = parseFloat(item.dbUnit) || 1;
        let newUnit = (parseFloat(item.unit) || 0) + delta * dbUnit;
        if (newUnit <= 0) {
          // 0 이하면 삭제 + 홀드 종료
          clearTimers();
          return [];
        }
        const unitQuantity = Math.round(newUnit / dbUnit);
        const totalPrice = calculateTotalPrice(item.pricePerUnit, newUnit);
        return [{ ...item, unit: newUnit.toString(), unitQuantity, totalPrice }];
      });
      return next;
    });
  };

  // Pointer 이벤트(마우스/터치 통일) + 포인터 캡처
  const onPressStart = (e, id, delta) => {
    e.preventDefault();
    try {
      e.currentTarget.setPointerCapture?.(e.pointerId);
    } catch {}
    stepChange(id, delta); // 즉시 1회
    clearTimers();
    holdTimeoutRef.current = setTimeout(() => {
      holdIntervalRef.current = setInterval(() => stepChange(id, delta), HOLD_INTERVAL);
    }, HOLD_START_DELAY);
  };

  const onPressEnd = e => {
    clearTimers();
    try {
      e?.currentTarget?.releasePointerCapture?.(e.pointerId);
    } catch {}
  };

  // 식재료 선택 핸들러
  const handleIngredientSelect = ingredient => {
    const existingIngredient = selectedIngredients.find(item => item.id === ingredient.id);

    if (existingIngredient) {
      const currentUnit = parseFloat(existingIngredient.unit) || 0;
      const dbUnit = parseFloat(ingredient.unit) || 10;
      const newUnit = currentUnit + dbUnit;
      const unitQuantity = Math.round(newUnit / dbUnit);
      const totalPrice = calculateTotalPrice(existingIngredient.pricePerUnit, newUnit);

      setSelectedIngredients(prev =>
        prev.map(item =>
          item.id === ingredient.id
            ? {
                ...item,
                unit: newUnit.toString(),
                unitQuantity,
                totalPrice,
              }
            : item
        )
      );
    } else {
      const dbUnit = parseFloat(ingredient.unit) || 10;
      const originalPrice = parseFloat(ingredient.price) || 0;
      const pricePerUnit = calculatePricePerUnit(originalPrice);
      const unitQuantity = 1;
      const totalPrice = calculateTotalPrice(pricePerUnit, dbUnit);

      setSelectedIngredients(prev => [
        ...prev,
        {
          ...ingredient,
          unit: dbUnit.toString(),
          dbUnit,
          originalPrice,
          pricePerUnit,
          unitQuantity,
          totalPrice,
        },
      ]);
    }
  };

  // 식재료 삭제 핸들러
  const handleRemoveIngredient = ingredientId => {
    setSelectedIngredients(prev => prev.filter(item => item.id !== ingredientId));
    clearTimers(); // 혹시 홀드 중이면 정지
  };

  // 언마운트 시 타이머 정리
  useEffect(() => () => clearTimers(), []);

  return (
    <div className={style.IngredientsSelection}>
      {/* 상단 - 식재료 검색 섹션 */}
      <div className={style.newingredientselection}>
        <p className={style.ingretitle}>기본 식재료 등록</p>
        <SearchInput
          placeholder="검색어를 입력하세요."
          onIngredientAdded={allIngredients}
          onIngredientSelect={handleIngredientSelect}
          resetSignal={resetSignal}
        />
      </div>

      {/* 하단 - 선택된 식재료 리스트 영역 */}
      <div className={style.ingredientlist}>
        <div className={style.titlezone}>
          {/* 제목 및 총 가격 표시 */}
          <h3 className={style.ingretitletwo}>선택한 식재료 목록</h3>
          <h4>총 가격: {calculateTotalSumPrice().toLocaleString()}원</h4>
        </div>

        {/* 공통 박스 - 식재료 없을 때 메시지 or 선택된 리스트 */}
        <div className={style.ingredientsListBox}>
          {selectedIngredients.length === 0 ? (
            <p className={style.noIngredientMessage}>검색을 통해 식재료를 선택해주세요.</p>
          ) : (
            selectedIngredients.map(ingredient => (
              <div key={ingredient.id} className={style.ingredientListItem}>
                {/* 식재료 정보 표시 */}
                <div className={style.ingredientInfo}>
                  <span className={style.ingredientName}>{ingredient.ingreName}</span>
                  <span className={style.priceInfo}>
                    {ingredient.totalPrice.toLocaleString()}원 (1g당{' '}
                    {ingredient.pricePerUnit.toFixed(0)}원)
                  </span>
                  <span className={style.unitInfo}>
                    개수: {ingredient.unitQuantity}개 ({ingredient.unit}g)
                  </span>
                </div>

                {/* 수량 조절 및 삭제 버튼 */}
                <div className={style.quantityControl}>
                  <div className={style.quantityWrapper}>
                    <button
                      type="button"
                      className={style.stepBtn}
                      onPointerDown={e => onPressStart(e, ingredient.id, -1)}
                      onPointerUp={onPressEnd}
                      onPointerCancel={onPressEnd}
                      onPointerLeave={onPressEnd}
                      aria-label="decrease"
                    >
                      ▾
                    </button>

                    <div className={style.unitReadout}>{ingredient.unit}g</div>

                    <button
                      type="button"
                      className={style.stepBtn}
                      onPointerDown={e => onPressStart(e, ingredient.id, +1)}
                      onPointerUp={onPressEnd}
                      onPointerCancel={onPressEnd}
                      onPointerLeave={onPressEnd}
                      aria-label="increase"
                    >
                      ▴
                    </button>
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
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default IngredientsSelection;
