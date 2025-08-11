import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styles from './AdditionalIngredients.module.scss';
import IngredientSearchInput from '@/common/forms/IngredientsSearch/IngredientSearchInput';
import { setAdditionalIngredients } from '@/store/productSlice';

const HOLD_START_DELAY = 300; // 길게 누르기 시작 지연(ms)
const HOLD_INTERVAL = 70; // 반복 간격(ms)

const AdditionalIngredients = () => {
  const dispatch = useDispatch();
  const { additionalIngredients } = useSelector(state => state.product);
  const [forceOpen] = useState(true);
  const scrollRef = useRef(null);

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
    const next = updater(additionalIngredients);
    dispatch(setAdditionalIngredients(next));
  };

  // 선택 시: 기존 있으면 dbUnit만큼 +, 없으면 추가(초기값=dbUnit)
  const handleSelect = item => {
    const exists = additionalIngredients.find(i => i.id === item.id);
    const dbUnit = Number(item.unit) || 1;
    if (exists) {
      updateList(list =>
        list.map(i =>
          i.id === item.id ? { ...i, quantity: (Number(i.quantity) || 0) + dbUnit } : i
        )
      );
    } else {
      updateList(list => [...list, { ...item, quantity: dbUnit }]);
    }
  };

  // 단일 스텝 변경 (+/- 1 step). 0 이하 → 자동 삭제
  const stepChange = (id, delta) => {
    updateList(list =>
      list.flatMap(i => {
        if (i.id !== id) return [i];
        const dbUnit = Number(i.unit) || 1;
        const next = (Number(i.quantity) || 0) + delta * dbUnit;
        if (next <= 0) return []; // 0이면 제거
        return [{ ...i, quantity: next }];
      })
    );
  };

  // ▼ Pointer 이벤트로 통일(마우스/터치 모두), 포인터 캡처로 이탈 방지
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

  const handleRemove = id => {
    updateList(list => list.filter(i => i.id !== id));
  };

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [additionalIngredients]);

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
          additionalIngredients.map(item => (
            <div className={styles.ingredientItem} key={item.id}>
              <span className={styles.name}>{item.ingreName}</span>

              <div className={styles.qtyControl}>
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

                  <div className={styles.unitReadout}>{Number(item.quantity) || 0}g</div>

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
              </div>

              <span className={styles.priceInfo}>/{item.price}원</span>
              <span className={styles.totalPrice}>
                {(Number(item.price) || 0) * (Number(item.quantity) || 0)}원
              </span>

              <button className={styles.removeBtn} onClick={() => handleRemove(item.id)}>
                ×
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdditionalIngredients;
