import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styles from './AdditionalIngredients.module.scss';
import IngredientSearchInput from '@/common/forms/IngredientsSearch/IngredientSearchInput';
import { setAdditionalIngredients } from '@/store/productSlice';

const HOLD_START_DELAY = 300;
const HOLD_INTERVAL = 70;

// 숫자 포맷: 3자리 콤마
const fmt = n => (Number(n) || 0).toLocaleString('ko-KR');

const AdditionalIngredients = () => {
  const dispatch = useDispatch();
  const { additionalIngredients, portion } = useSelector(state => state.product);
  const [forceOpen] = useState(true);
  const scrollRef = useRef(null);

  // 최신 리스트 ref
  const latestListRef = useRef(additionalIngredients);
  useEffect(() => {
    latestListRef.current = additionalIngredients;
  }, [additionalIngredients]);

  // 이전 길이 저장 → 길이가 늘어날 때만 스크롤 하단
  const prevLenRef = useRef(additionalIngredients.length);
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    if (additionalIngredients.length > prevLenRef.current) {
      el.scrollTop = el.scrollHeight; // 새 항목 추가될 때만
    }
    prevLenRef.current = additionalIngredients.length;
  }, [additionalIngredients]);

  // 길게 누르기 타이머
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

  const updateList = updater => {
    const next = updater(latestListRef.current);
    dispatch(setAdditionalIngredients(next));
  };

  // 선택시 추가 또는 수량 +unit
  const handleSelect = item => {
    const step = Number(item.unit) || 1;
    const exists = latestListRef.current.find(i => i.id === item.id);
    if (exists) {
      updateList(list =>
        list.map(i => (i.id === item.id ? { ...i, quantity: (Number(i.quantity) || 0) + step } : i))
      );
    } else {
      updateList(list => [...list, { ...item, quantity: step }]);
    }
  };

  // 수량 증감
  const stepChange = (id, delta) => {
    updateList(list => {
      const next = list.flatMap(i => {
        if (i.id !== id) return [i];
        const step = Number(i.unit) || 1;
        const q = (Number(i.quantity) || 0) + delta * step;
        return q <= 0 ? [] : [{ ...i, quantity: q }];
      });
      if (list.some(i => i.id === id) && !next.some(i => i.id === id)) clearTimers();
      return next;
    });
  };

  // 포인터 이벤트
  const onPressStart = (e, id, delta) => {
    e.preventDefault();
    try {
      e.currentTarget.setPointerCapture?.(e.pointerId);
    } catch {}
    stepChange(id, delta);
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

  const handleRemove = id => updateList(list => list.filter(i => i.id !== id));

  useEffect(() => () => clearTimers(), []);

  return (
    <div className={styles.additionalIngredientsWrapper}>
      <div className={styles.leftSection}>
        <h3>추가 식재료</h3>
        <IngredientSearchInput
          placeholder="식재료를 입력하세요"
          onSelect={handleSelect}
          forceOpen={false}
          closeOnSelect={false}
        />
      </div>

      <div className={styles.rightSection} ref={scrollRef}>
        {additionalIngredients.length === 0 ? (
          <div className={styles.emptyMessage}>추가 식재료가 없습니다.</div>
        ) : (
          additionalIngredients.map(item => {
            const qty = Number(item.quantity) || 0; // 1인분 g
            const unitPrice = Number(item.price) || 0; // 원(단가)
            const totalGram = qty * portion; // 총 g
            const totalPrice = unitPrice * qty * portion; // 총 원 (표시는 안하지만 필요시 사용)

            return (
              <div className={styles.ingredientItem} key={item.id}>
                {/* 1. 이름 */}
                <span className={styles.name}>{item.ingreName}</span>

                {/* 2. 수량조절기 */}
                <div className={styles.quantityWrapper}>
                  <button
                    type="button"
                    className={styles.stepBtn}
                    onPointerDown={e => onPressStart(e, item.id, -1)}
                    onPointerUp={onPressEnd}
                    onPointerCancel={onPressEnd}
                    onPointerLeave={onPressEnd}
                    aria-label="decrease"
                  >
                    –
                  </button>

                  <div className={styles.unitReadout}>{fmt(qty)}g</div>

                  <button
                    type="button"
                    className={styles.stepBtn}
                    onPointerDown={e => onPressStart(e, item.id, +1)}
                    onPointerUp={onPressEnd}
                    onPointerCancel={onPressEnd}
                    onPointerLeave={onPressEnd}
                    aria-label="increase"
                  >
                    +
                  </button>
                </div>

                {/* 3. 가격/인분 */}
                <span className={styles.priceInfo}>
                  /{fmt(unitPrice)}원 × {portion}인분
                </span>

                {/* 4. 총그램 */}
                <span className={styles.totalGram}>총 {fmt(totalGram)}g</span>

                {/* 5. 삭제 */}
                <button className={styles.removeBtn} onClick={() => handleRemove(item.id)}>
                  ×
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default AdditionalIngredients;
