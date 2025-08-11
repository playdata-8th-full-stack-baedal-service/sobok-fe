import React, { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { useIngredientSearch } from '../../hooks/useIngredientSearch';
import { fetchAdditionalIngredients } from '@/store/productSlice';
import styles from './IngredientSearchInput.module.scss';

const IngredientSearchInput = ({
  placeholder = '검색어를 입력하세요.',
  onSelect,
  showAddButton = false,
  onAddIngredient,
  forceOpen = false,
  closeOnSelect = false, // 관리자 페이지에서만 true로 사용
}) => {
  const [keyword, setKeyword] = useState('');
  const [isOpen, setIsOpen] = useState(forceOpen);
  const [hasInteractedOutside, setHasInteractedOutside] = useState(false);
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);
  const scrollRef = useRef(null);

  const dispatch = useDispatch();
  const { searchResults, loading } = useIngredientSearch(keyword);
  const safeResults = searchResults || [];

  // 외부 클릭 감지
  useEffect(() => {
    const handleClickOutside = event => {
      if (forceOpen) return;
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setHasInteractedOutside(true);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [forceOpen]);

  // 외부 클릭 후 상태 초기화
  useEffect(() => {
    if (hasInteractedOutside) {
      const t = setTimeout(() => setHasInteractedOutside(false), 100);
      return () => clearTimeout(t);
    }
  }, [hasInteractedOutside]);

  // forceOpen이 변경될 때 항상 열림
  useEffect(() => {
    if (forceOpen) setIsOpen(true);
  }, [forceOpen]);

  // ◀ 신규: 등록 모달에서 발행한 이벤트 수신
  useEffect(() => {
    const onRegistered = e => {
      const ing = e.detail;
      if (!ing) return;

      // 1) 검색창 리셋 + 열어둠
      setKeyword('');
      setIsOpen(true);

      // 2) 자동 선택(추가) — onSelect로 전달
      onSelect?.({
        ...ing,
        quantity: ing.unit, // 기존 onSelect 시그니처와 동일
      });

      // 3) 검색 결과도 새로고침(선택 사항)
      dispatch(fetchAdditionalIngredients(''));

      // 4) 스크롤 위치 유지(필요 시)
      requestAnimationFrame(() => {
        if (scrollRef.current) {
          // 유지하고 싶으면 현재 값을 그대로 다시 설정
          const top = scrollRef.current.scrollTop || 0;
          scrollRef.current.scrollTop = top;
        }
      });

      // 입력 포커스 유지(원하면)
      inputRef.current?.focus();
    };

    window.addEventListener('INGREDIENT_REGISTERED', onRegistered);
    return () => window.removeEventListener('INGREDIENT_REGISTERED', onRegistered);
  }, [dispatch, onSelect]);

  return (
    <div className={styles.searchContainer} ref={dropdownRef}>
      <input
        ref={inputRef}
        type="search"
        value={keyword}
        placeholder={placeholder}
        onChange={e => {
          setKeyword(e.target.value);
          setIsOpen(true);
        }}
        onKeyDown={e => {
          if (e.key === 'Enter') e.preventDefault();
        }}
        onFocus={() => {
          setIsOpen(true);
          if (!keyword) dispatch(fetchAdditionalIngredients(''));
        }}
        className={styles.searchbar}
      />

      {loading && isOpen && <div className={styles.dropdownmenu}>검색 중...</div>}

      {(isOpen || forceOpen) && (safeResults.length > 0 || showAddButton) && (
        <div className={styles.dropdownContainer}>
          <div
            className={`${styles.scrollWrapper} ${safeResults.length > 6 ? styles.scrollable : ''}`}
            ref={scrollRef}
          >
            {showAddButton && keyword && !safeResults.some(item => item.ingreName === keyword) && (
              <div
                className={styles.dropdownmenuadd}
                onMouseDown={e => {
                  e.preventDefault();
                  e.stopPropagation();
                  const prevTop = scrollRef.current?.scrollTop ?? 0;
                  onAddIngredient && onAddIngredient(keyword);
                  if (closeOnSelect) {
                    setIsOpen(false);
                    inputRef.current?.blur();
                  } else {
                    requestAnimationFrame(() => {
                      if (scrollRef.current) scrollRef.current.scrollTop = prevTop;
                    });
                  }
                }}
                style={{ cursor: 'pointer' }}
              >
                식재료 추가 +
              </div>
            )}

            {safeResults.map(item => (
              <div
                key={item.id}
                className={styles.dropdownmenu}
                style={{ cursor: 'pointer' }}
                onMouseDown={e => {
                  e.preventDefault();
                  e.stopPropagation();
                  const prevTop = scrollRef.current?.scrollTop ?? 0;

                  onSelect({
                    ...item,
                    quantity: item.unit,
                  });

                  if (closeOnSelect) {
                    setIsOpen(false);
                    inputRef.current?.blur();
                  } else if (!forceOpen) {
                    requestAnimationFrame(() => {
                      if (scrollRef.current) scrollRef.current.scrollTop = prevTop;
                    });
                  }
                }}
              >
                {item.ingreName}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default IngredientSearchInput;
